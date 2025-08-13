import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generateAvatarImage } from "@/lib/stableDiffusion";

const AvatarPage = () => {
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = await generateAvatarImage(prompt, apiKey);
    setImageUrl(url);
  };

  return (
    <main className="container max-w-md py-10">
      <h1 className="text-2xl font-bold mb-4">Avatar Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your avatar"
        />
        <Input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="HuggingFace API key"
          type="password"
        />
        <Button type="submit">Generate</Button>
      </form>
      <div className="mt-6">
        <Avatar className="h-24 w-24">
          {imageUrl ? (
            <AvatarImage src={imageUrl} alt="Generated avatar" />
          ) : (
            <AvatarFallback>Preview</AvatarFallback>
          )}
        </Avatar>
      </div>
    </main>
  );
};

export default AvatarPage;
