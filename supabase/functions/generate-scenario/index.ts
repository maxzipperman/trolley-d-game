import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { seed, tags = [], style = "" } = await req.json();

    const prompt = `Generate a trolley problem scenario with tags: ${Array.isArray(tags) ? tags.join(", ") : tags} and style: ${style}`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: cacheData, error: cacheError } = await supabase
      .from("gen_cache")
      .select("result")
      .eq("prompt", prompt)
      .eq("seed", seed)
      .maybeSingle();

    if (!cacheError && cacheData) {
      return new Response(JSON.stringify(cacheData.result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("PERPLEXITY_API_KEY");
    if (!apiKey) {
      throw new Error("Missing PERPLEXITY_API_KEY");
    }

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          { role: "system", content: "You are a scenario generator." },
          {
            role: "user",
            content:
              `Seed: ${seed}\nTags: ${tags.join(", ")}\nStyle: ${style}\nReturn JSON with fields id,title,description,track_a,track_b,tags.`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    const scenario = JSON.parse(data.choices[0].message.content);

    await supabase.from("gen_cache").insert({ prompt, seed, result: scenario });

    return new Response(JSON.stringify(scenario), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
