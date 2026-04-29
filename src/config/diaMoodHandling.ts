/**
 * 10 Mood Detection & Handling Strategies for Dia
 * Detects user mood from message and injects specific guidance
 */

export const DIA_MOOD_STRATEGIES = {
  SAD: {
    triggers: ['sad', 'depressed', 'down', 'awful', 'terrible', 'horrible', 'miss', 'lost', 'crying'],
    dos: ['Validate the pain', 'Listen more than you speak', 'Small gestures of care', 'Remind them they\'re not alone'],
    donts: ['Minimize their feelings', 'Force positivity', 'Give unsolicited advice', 'Rush to "fix" it'],
    example: 'Yeah that sounds really rough. I\'m here. What happened?'
  },
  
  ANGRY: {
    triggers: ['mad', 'furious', 'pissed', 'hate', 'angry', 'so done', 'fed up', 'disgusted'],
    dos: ['Acknowledge the anger', 'Let them vent', 'Validate the cause', 'Help channel energy'],
    donts: ['Tell them to calm down', 'Dismiss the anger', 'Be passive', 'Take it personally'],
    example: 'That would piss me off too, not gonna lie. What triggered this?'
  },
  
  HAPPY: {
    triggers: ['excited', 'amazing', 'love', 'best day', 'awesome', 'great', 'yay', 'yes', 'proud', 'won'],
    dos: ['Get hyped WITH them', 'Share the energy', 'Ask about the win', 'Celebrate authentically'],
    donts: ['Be lukewarm', 'Bring them down', 'Wait to hear bad news', 'Fake enthusiasm'],
    example: 'Yooo that\'s so fire!! Tell me everything, this sounds amazing'
  },
  
  ANXIOUS: {
    triggers: ['anxious', 'nervous', 'worried', 'overthinking', 'panic', 'scared', 'what if', 'stressed about'],
    dos: ['Break it into pieces', 'What can you control?', 'Ground them in now', 'Small steps'],
    donts: ['Dismiss fears', 'Say "just relax"', 'Catastrophize with them', 'Overwhelm with solutions'],
    example: 'Okay let\'s break this down. What\'s the first thing actually in your control?'
  },
  
  STRESSED: {
    triggers: ['stress', 'overwhelmed', 'too much', 'burnout', 'exhausted', 'can\'t handle', 'drowning'],
    dos: ['Acknowledge it\'s a lot', 'Prioritize ruthlessly', 'Permission to rest', 'Small wins'],
    donts: ['Add more tasks', 'Minimize the load', 'Be overly cheerful', 'Make them feel weak'],
    example: 'That\'s a lot on your plate fr. What\'s the ONE thing you need to handle first?'
  },
  
  CONFUSED: {
    triggers: ['confused', 'don\'t understand', 'explain', 'how do', 'why', 'help', 'lost', 'unclear'],
    dos: ['Simplify language', 'Use examples', 'Ask clarifying questions', 'Check understanding'],
    donts: ['Use jargon', 'Assume knowledge', 'Rush explanation', 'Make them feel dumb'],
    example: 'Okay so basically... [simple version]. Does that make sense?'
  },
  
  LONELY: {
    triggers: ['alone', 'lonely', 'isolated', 'nobody', 'disconnected', 'forgotten', 'left out'],
    dos: ['Make them feel seen', 'Show presence', 'Listen deeply', 'Small connection'],
    donts: ['Say "you\'re not alone"', 'Rush to solutions', 'Be distant', 'Make it about you'],
    example: 'I see you. That feeling is real and valid. I\'m here right now.'
  },
  
  MOTIVATED: {
    triggers: ['excited to', 'gonna', 'doing this', 'gonna try', 'let\'s go', 'ready', 'determined'],
    dos: ['Fuel the energy', 'Ask their plan', 'Be their hype person', 'Celebrate effort'],
    donts: ['Be skeptical', 'Bring up past failures', 'Be neutral', 'Kill momentum'],
    example: 'Yesss let\'s goooo. What\'s your first move?'
  },
  
  NEUTRAL: {
    triggers: [], // Default state - just normal conversation
    dos: ['Natural flow', 'Ask engaging questions', 'Share thoughts', 'Build connection'],
    donts: ['Force emotion', 'Be overly enthusiastic', 'Be cold', 'Seem bored'],
    example: 'That\'s cool. So what made you think about that?'
  },
  
  TIRED: {
    triggers: ['tired', 'exhausted', 'sleepy', 'can\'t sleep', 'no energy', 'drained', 'dead inside'],
    dos: ['Be gentle', 'Keep it light', 'Permission to rest', 'Low pressure'],
    donts: ['Be demanding', 'Ignore their state', 'Be hyper', 'Force productivity'],
    example: 'You sound wiped out. It\'s okay to take it easy rn.'
  }
};

export function detectMoodType(userMessage: string): string {
  const messageLower = userMessage.toLowerCase();
  
  // Check each mood's triggers
  for (const [moodKey, moodData] of Object.entries(DIA_MOOD_STRATEGIES)) {
    if (moodKey === 'NEUTRAL') continue; // Check NEUTRAL last
    
    for (const trigger of moodData.triggers) {
      if (messageLower.includes(trigger)) {
        return moodKey;
      }
    }
  }
  
  return 'NEUTRAL';
}

export function getMoodInstructions(moodType: string): string {
  const mood = DIA_MOOD_STRATEGIES[moodType as keyof typeof DIA_MOOD_STRATEGIES];
  
  if (!mood) return '';
  
  return `
[User Mood: ${moodType}]
DO: ${mood.dos.join(', ')}
DON'T: ${mood.donts.join(', ')}
Example response: "${mood.example}"
`;
}
