var EndingScoringFactors = [
	{
		endingProp: 'endingWindDown',
		summary: "The company has been wound down.",
		tag: "Game Over",
		scoreName: 'Winding Down',
		scoreValue: 0,
		scoreClass: ["ii","arrow"]
	},
	{
		endingProp: 'endingAcquihire',
		summary: "You and your team have been acquihired.",
		tag: "The End",
		scoreName: 'Acquihired',
		scoreValue: 100,
		scoreClass: ["ii","arrow"]
	},
	{
		endingProp: 'endingAcquisition',
		summary: "The company has been acquired.",
		tag: "The End",
		scoreName: 'Acquisition',
		scoreValue: 200,
		scoreClass: ["ii","arrow"]
	},
	{
		endingProp: 'endingPrivate',
		summary: "The company has remained private.",
		tag: "The End",
		scoreName: 'Staying Private',
		scoreValue: 300,
		scoreClass: ["ii","arrow"]
	},
	{
		endingProp: 'endingIPO',
		summary: "The company has gone public with an IPO",
		tag: "The End",
		scoreName: 'Going Public',
		scoreValue: 300,
		scoreClass: ["ii","arrow"]
	},
	{
		endingProp: 'endingFAANG',
		summary: "The company has been acquired by a massive player.",
		tag: "The End",
		scoreName: 'Massive Acquisition',
		scoreValue: 300,
		scoreClass: ["ii","arrow"]
	},
	{
		endingProp: 'endingNewCEO',
		summary: "You've been replaced with a new CEO.",
		tag: "The End",
		scoreName: 'Replacement CEO',
		scoreValue: 300,
		scoreClass: ["ii","arrow"]
	}
]



export default EndingScoringFactors;