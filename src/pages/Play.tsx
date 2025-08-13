37
const i = scenarios.findIndex(s => s.id === jump);
38
return i >= 0 ? i : 0;
39    }
40
// find first unanswered
41
const i = scenarios.findIndex(s => answers[s.id] == null);
42
return i >= 0 ? i : 0;
43  }, [scenarios, params, answers, daily]);
44

45
const total = scenarios.length;
46

47
if (total === 0) {
48
  return (
49
    <div className="min-h-screen container max-w-2xl py-8">
50
      <p className="text-muted-foreground">No scenarios available. Please add data/scenarios.json.</p>
51
    </div>
52
  );
53
}
54

55
const s = scenarios[index] as Scenario;
56

57
// progress as percentage for UI components that expect %
58
const progress = ((index + 1) / total) * 100;
59

60
// memoized counts based on answers
61
const countSkipped = useMemo(
62
  () => Object.values(answers).filter(a => a === "skip").length,
63
  [answers]
64
);
65

66
const countLeft = useMemo(
67
  () => scenarios ? scenarios.filter(sc => answers[sc.id] == null).length : 0,
68
  [scenarios, answers]
69
);
70

71
const firstSkipped = useMemo(
72
  () => scenarios?.find(sc => answers[sc.id] === "skip"),
73
  [scenarios, answers]
74
);
75

76
useEffect(() => {
77
const onKey = (e: KeyboardEvent) => {
78
if (e.key === "ArrowLeft") { pick("A"); }
79
if (e.key === "ArrowRight") { pick("B"); }
80
if (e.key.toLowerCase() === "s") { skip(); }
81    };
82
window.addEventListener("keydown", onKey);
83
return () => window.removeEventListener("keydown", onKey);
84  });
85

86
if (loading || !scenarios) {
87
return (
88
<main className="min-h-screen container py-10">
89
<div className="h-2 w-full bg-muted rounded-md overflow-hidden">
90
<div className="h-full w-1/3 bg-foreground/60 animate-pulse" />
91
</div>
92
      );
93
    }
94

95
  function advance() {
96
if (daily) {
97
recordCompletion();
98
navigate("/results");
99
return;
100    }
101
// next unanswered or end
102
const nextIdx = scenarios.findIndex((sc, i) => i > index && answers[sc.id] == null);
103
if (nextIdx >= 0) {
104
navigate(`/play?jump=${scenarios[nextIdx].id}`);
105    } else if (index + 1 < total) {
106
navigate(`/play?jump=${scenarios[index + 1].id}`);
107    } else {
108
navigate("/results");
109    }
110  }
111

112  async function record(choice: Choice) {
113
if (!s) return;
114
setAnswers({ ...answers, [s.id]: choice });
115
await submitChoice(s.id, choice);
116
try {
117
const stats = await fetchScenarioStats(s.id);
118
toast(`Global choices – A ${stats.percentA}% · B ${stats.percentB}%`);
119    } catch (err) {
120
console.error(err);
121    }
122
advance();