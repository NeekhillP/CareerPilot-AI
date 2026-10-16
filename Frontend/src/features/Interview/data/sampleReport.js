const sampleReport = {
    matchScore: 82,
    technicalQuestions: [
        {
            question: 'How would you keep cached data consistent with your database?',
            intention: 'Understand your approach to caching, data consistency, and the trade-offs involved.',
            answer: 'Start with a cache-aside approach: read from Redis first, then query the database on a cache miss. After a successful database update, invalidate the related cache entry. Explain how a suitable time-to-live limits stale data and how you would handle a cache outage without taking the application offline.'
        },
        {
            question: 'What happens when a Node.js application runs a CPU-intensive task?',
            intention: 'Assess your understanding of the event loop and application responsiveness.',
            answer: 'Explain that synchronous CPU-intensive work blocks the event loop and delays other requests. Discuss moving that work to a worker thread or a background job, and describe how you would measure the effect on response times.'
        },
        {
            question: 'How would you design a reliable background job system?',
            intention: 'Explore your understanding of asynchronous processing and failure recovery.',
            answer: 'Describe a producer, a durable queue, and separate workers. Cover retries with backoff, idempotent processing, and a dead-letter queue. Explain how you would monitor failed jobs and queue depth.'
        }
    ],
    behavioralQuestions: [
        {
            question: 'Tell me about a time you worked through an unclear requirement.',
            intention: 'Understand how you clarify a problem and collaborate before implementing a solution.',
            answer: 'Choose a real example. Describe the ambiguity, the questions you asked, and how you agreed on a useful outcome. Walk through your contribution and what you learned, using measurable results only when you have them.'
        },
        {
            question: 'How do you respond when you disagree with a technical decision?',
            intention: 'Assess your communication, judgment, and ability to work constructively with a team.',
            answer: 'Explain how you make the trade-offs explicit, listen to the other perspective, and gather evidence. Use a real example to show how you helped the team make a decision and supported the agreed approach.'
        }
    ],
    skillGaps: [
        {skill: 'Redis', severity: 'high'},
        {skill: 'Message queues', severity: 'medium'},
        {skill: 'Node.js event loop', severity: 'low'}
    ],
    preparationPlan: [
        {
            day: 1,
            focus: 'Caching fundamentals',
            tasks: [
                'Review cache-aside, time-to-live, and cache invalidation.',
                'Build a small Redis-backed cache for a sample API.',
                'Practice explaining what happens when the cache is unavailable.'
            ]
        },
        {
            day: 2,
            focus: 'Asynchronous systems',
            tasks: [
                'Trace a Node.js request through the event loop.',
                'Create a background job with retries and idempotent processing.',
                'Compare worker threads with a separate queue-based worker.'
            ]
        },
        {
            day: 3,
            focus: 'Put your preparation into practice',
            tasks: [
                'Answer the technical questions aloud without reading your notes.',
                'Prepare two real examples using the situation, task, action, result structure.',
                'Review unclear answers and prepare questions for the interviewer.'
            ]
        }
    ]
}

export default sampleReport
