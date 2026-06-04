const pageName = location.pathname.split('/').pop();

const saveSession = (session) => localStorage.setItem('sisSession', JSON.stringify(session));
const getSession = () => JSON.parse(localStorage.getItem('sisSession') || 'null');

const questionBank = {
  Java: {
    Easy: [
      { text: 'What is the difference between ArrayList and LinkedList in Java?', keywords: ['ArrayList', 'LinkedList', 'dynamic', 'nodes'], ideal: 'ArrayList uses a dynamic array and is better for random access, while LinkedList uses nodes and is better for frequent inserts/deletes.' },
      { text: 'Explain what JVM, JRE, and JDK are in Java.', keywords: ['JVM', 'JRE', 'JDK', 'runtime', 'compiler'], ideal: 'JVM runs bytecode, JRE contains JVM plus libraries, and JDK includes tools to compile and build Java applications.' },
      { text: 'What does the static keyword do in Java?', keywords: ['static', 'class variable', 'method', 'shared'], ideal: 'Static makes a member belong to the class instead of instances, so it is shared across all objects.' },
      { text: 'What is the purpose of the final keyword in Java?', keywords: ['final', 'constant', 'immutable', 'override'], ideal: 'Final prevents reassignment for variables, prevents subclassing for classes, and prevents overriding for methods.' },
      { text: 'Describe method overloading and give an example.', keywords: ['overloading', 'same name', 'different parameters', 'compile-time'], ideal: 'Method overloading lets multiple methods share a name but differ by parameter types or counts.' }
    ],
    Medium: [
      { text: 'Explain garbage collection in Java and when it runs.', keywords: ['garbage collection', 'heap', 'GC', 'memory'], ideal: 'Garbage collection frees unused objects from the heap automatically, and it runs when memory is needed or based on GC heuristics.' },
      { text: 'How does a HashMap differ from a Hashtable?', keywords: ['HashMap', 'Hashtable', 'synchronized', 'null'], ideal: 'HashMap is unsynchronized and allows nulls, while Hashtable is synchronized and does not allow null keys or values.' },
      { text: 'What is a Java Stream and how is it used?', keywords: ['stream', 'filter', 'map', 'collect'], ideal: 'Java Stream API processes collections in a functional style using operations like map, filter, and collect.' },
      { text: 'How does exception handling work in Java?', keywords: ['try', 'catch', 'finally', 'throw', 'throws'], ideal: 'Use try/catch to handle exceptions, optionally finally for cleanup, and throw or throws for propagation.' },
      { text: 'What is synchronization and why is it used in Java?', keywords: ['synchronization', 'thread-safe', 'lock', 'race condition'], ideal: 'Synchronization controls access to shared resources to prevent race conditions in multi-threaded code.' }
    ],
    Hard: [
      { text: 'Explain the Java memory model and volatile keyword.', keywords: ['memory model', 'volatile', 'visibility', 'ordering'], ideal: 'The Java memory model defines how threads interact through memory, and volatile ensures visibility of writes across threads.' },
      { text: 'How do you implement a thread-safe singleton in Java?', keywords: ['singleton', 'thread-safe', 'double-checked locking', 'synchronized'], ideal: 'A thread-safe singleton uses synchronized blocks or enum-based singletons to ensure only one instance is created.' },
      { text: 'What is the difference between checked and unchecked exceptions?', keywords: ['checked', 'unchecked', 'compile time', 'runtime'], ideal: 'Checked exceptions must be handled or declared, while unchecked exceptions are runtime errors that do not need explicit handling.' },
      { text: 'Describe the role of class loaders in Java.', keywords: ['class loader', 'bootstrap', 'application', 'dynamic loading'], ideal: 'Class loaders load classes into JVM, enabling dynamic loading and separation of namespaces.' },
      { text: 'Explain the use of generics and wildcards in Java.', keywords: ['generics', 'wildcards', 'extends', 'super'], ideal: 'Generics add type safety to collections, and wildcards enable flexible subtype relationships.' }
    ]
  },
  Python: {
    Easy: [
      { text: 'What is the difference between a list and a tuple in Python?', keywords: ['list', 'tuple', 'mutable', 'immutable'], ideal: 'Lists are mutable and tuples are immutable, making tuples suitable for fixed collections.' },
      { text: 'How do you create a dictionary in Python?', keywords: ['dictionary', 'dict', 'key', 'value'], ideal: 'A dict uses key:value pairs, written as {\'key\': value}.' },
      { text: 'What is a list comprehension?', keywords: ['list comprehension', 'syntax', 'compact', 'for'], ideal: 'List comprehensions create lists in a compact form using an expression and a for loop.' },
      { text: 'How do you handle errors in Python?', keywords: ['try', 'except', 'finally', 'raise'], ideal: 'Use try/except to catch exceptions, optionally finally for cleanup, and raise to throw errors.' },
      { text: 'What is the difference between == and is in Python?', keywords: ['==', 'is', 'equality', 'identity'], ideal: '== checks value equality, while is checks object identity.' }
    ],
    Medium: [
      { text: 'Explain how Python generators work.', keywords: ['generator', 'yield', 'lazy', 'iteration'], ideal: 'Generators use yield to produce values lazily, saving memory during iteration.' },
      { text: 'What is the difference between shallow and deep copy?', keywords: ['shallow copy', 'deep copy', 'copy', 'nested'], ideal: 'Shallow copy duplicates the outer object, while deep copy duplicates nested objects as well.' },
      { text: 'How does Python handle function arguments with *args and **kwargs?', keywords: ['*args', '**kwargs', 'positional', 'keyword'], ideal: '*args collects positional args and **kwargs collects keyword args in functions.' },
      { text: 'Describe the purpose of decorators in Python.', keywords: ['decorator', 'wrapper', 'function', 'syntax'], ideal: 'Decorators wrap functions to modify behavior without changing the original code.' },
      { text: 'Explain the difference between local and global variables.', keywords: ['local', 'global', 'scope', 'namespace'], ideal: 'Local variables exist inside a function, while globals are visible throughout the module.' }
    ],
    Hard: [
      { text: 'What is the GIL and how does it affect Python concurrency?', keywords: ['GIL', 'global interpreter lock', 'threading', 'concurrency'], ideal: 'GIL prevents multiple threads from executing Python bytecode simultaneously, limiting CPU-bound concurrency.' },
      { text: 'How do you optimize Python code for performance?', keywords: ['profiling', 'caching', 'vectorization', 'async'], ideal: 'Optimize by profiling bottlenecks, using caching, vectorizing loops, and choosing appropriate algorithms.' },
      { text: 'Explain context managers and the with statement.', keywords: ['context manager', 'with', '__enter__', '__exit__'], ideal: 'Context managers manage setup/teardown logic and are used with with for safe resource handling.' },
      { text: 'What are metaclasses in Python?', keywords: ['metaclass', 'type', 'class creation', 'customize'], ideal: 'Metaclasses are classes of classes that customize class creation and behavior.' },
      { text: 'How does async/await work in Python?', keywords: ['async', 'await', 'coroutine', 'event loop'], ideal: 'Async/await enables asynchronous coroutines that run cooperatively on an event loop.' }
    ]
  },
  DBMS: {
    Easy: [
      { text: 'What is a primary key in a database?', keywords: ['primary key', 'unique', 'identifier', 'record'], ideal: 'A primary key uniquely identifies each record in a table.' },
      { text: 'Explain the difference between SQL and NoSQL.', keywords: ['SQL', 'NoSQL', 'relational', 'schema'], ideal: 'SQL databases are relational with fixed schemas, while NoSQL databases are non-relational and schema-flexible.' },
      { text: 'What is normalization?', keywords: ['normalization', 'redundancy', 'tables', 'dependencies'], ideal: 'Normalization organizes data into tables to reduce redundancy and improve integrity.' },
      { text: 'What is an index and why is it used?', keywords: ['index', 'performance', 'search', 'query'], ideal: 'An index speeds up query lookup by providing quick access to table rows.' },
      { text: 'Describe the difference between DELETE and TRUNCATE.', keywords: ['delete', 'truncate', 'transaction', 'rollback'], ideal: 'DELETE removes rows one by one and can be rolled back, while TRUNCATE removes all rows faster and may not be transactional.' }
    ],
    Medium: [
      { text: 'What are ACID properties in databases?', keywords: ['atomicity', 'consistency', 'isolation', 'durability'], ideal: 'ACID ensures reliable transactions by guaranteeing atomicity, consistency, isolation, and durability.' },
      { text: 'Explain the difference between inner join and left join.', keywords: ['inner join', 'left join', 'rows', 'matching'], ideal: 'Inner join returns only matching rows, while left join returns all left-side rows and matching right-side rows.' },
      { text: 'What is a transaction and why is it important?', keywords: ['transaction', 'commit', 'rollback', 'atomic'], ideal: 'A transaction groups operations so they succeed or fail together, preserving database integrity.' },
      { text: 'How does indexing affect insert performance?', keywords: ['indexing', 'insert', 'performance', 'overhead'], ideal: 'Indexes speed reads but add overhead on inserts because index structures must also be updated.' },
      { text: 'What is denormalization and when would you use it?', keywords: ['denormalization', 'performance', 'redundancy', 'query'], ideal: 'Denormalization adds redundancy to speed query performance for read-heavy workloads.' }
    ],
    Hard: [
      { text: 'Explain isolation levels and write phenomena in transactions.', keywords: ['isolation', 'dirty read', 'phantom read', 'repeatable read'], ideal: 'Isolation levels control how transactions see changes, preventing phenomena like dirty reads and phantom reads.' },
      { text: 'What is a clustered index?', keywords: ['clustered index', 'physical order', 'primary key', 'B-tree'], ideal: 'A clustered index stores rows in physical order based on a key, often the primary key.' },
      { text: 'How does sharding work in a distributed database?', keywords: ['sharding', 'partition', 'distributed', 'scale'], ideal: 'Sharding splits data across nodes to scale horizontally and reduce single-node load.' },
      { text: 'Describe eventual consistency in distributed systems.', keywords: ['eventual consistency', 'replication', 'latency', 'availability'], ideal: 'Eventual consistency means replicas converge over time, trading immediate consistency for availability.' },
      { text: 'What is query optimization and how does the optimizer work?', keywords: ['optimizer', 'execution plan', 'statistics', 'cost'], ideal: 'The optimizer chooses the cheapest execution plan using statistics and cost estimates.' }
    ]
  },
  OS: {
    Easy: [
      { text: 'What is the difference between a process and a thread?', keywords: ['process', 'thread', 'memory', 'context'], ideal: 'A process is an isolated program instance, while a thread is a lightweight path of execution inside a process.' },
      { text: 'What does CPU scheduling do?', keywords: ['scheduling', 'CPU', 'time slice', 'process'], ideal: 'CPU scheduling decides which process or thread runs next on the processor.' },
      { text: 'Explain what virtual memory is.', keywords: ['virtual memory', 'paging', 'swap', 'address'], ideal: 'Virtual memory lets the OS use disk space to extend physical memory and manage process address spaces.' },
      { text: 'What is a deadlock?', keywords: ['deadlock', 'resources', 'circular wait', 'mutex'], ideal: 'Deadlock occurs when processes wait forever for each other to release resources.' },
      { text: 'What is the role of an operating system?', keywords: ['OS', 'resource management', 'hardware', 'interface'], ideal: 'The OS manages hardware resources and provides services to applications.' }
    ],
    Medium: [
      { text: 'How does context switching happen?', keywords: ['context switch', 'registers', 'stack', 'scheduler'], ideal: 'Context switching saves a process state and loads another so the CPU can switch tasks.' },
      { text: 'What is paging and how does it work?', keywords: ['paging', 'frames', 'pages', 'memory'], ideal: 'Paging divides memory into fixed-size pages mapped to physical frames to simplify allocation.' },
      { text: 'Explain CPU-bound versus I/O-bound processes.', keywords: ['CPU-bound', 'I/O-bound', 'performance', 'waiting'], ideal: 'CPU-bound processes spend most time computing, while I/O-bound processes wait for input/output.' },
      { text: 'What is a kernel and what does it do?', keywords: ['kernel', 'core', 'system calls', 'hardware'], ideal: 'The kernel is the OS core that manages system calls, hardware, and process control.' },
      { text: 'How is memory protection implemented?', keywords: ['protection', 'access rights', 'MMU', 'segmentation'], ideal: 'Memory protection uses hardware and tables to prevent unauthorized access between processes.' }
    ],
    Hard: [
      { text: 'Explain interrupt handling and interrupt vectors.', keywords: ['interrupt', 'handler', 'vector', 'ISR'], ideal: 'Interrupt handling routes external events to a handler using an interrupt vector table.' },
      { text: 'What is demand paging and how does it improve performance?', keywords: ['demand paging', 'lazy loading', 'page fault', 'memory'], ideal: 'Demand paging loads pages only when needed, reducing memory usage and startup cost.' },
      { text: 'Describe the difference between preemptive and cooperative multitasking.', keywords: ['preemptive', 'cooperative', 'scheduler', 'yield'], ideal: 'Preemptive multitasking allows the OS to interrupt tasks, while cooperative relies on tasks yielding control.' },
      { text: 'What is a race condition and how do you prevent it?', keywords: ['race condition', 'synchronization', 'mutex', 'atomic'], ideal: 'A race condition occurs when multiple threads access shared data without coordination; use locks or atomic operations to prevent it.' },
      { text: 'How does demand paging differ from swapping?', keywords: ['swapping', 'demand paging', 'disk', 'memory'], ideal: 'Swapping moves entire processes in and out of memory, while demand paging loads individual pages as needed.' }
    ]
  },
  'CS Basics': {
    Easy: [
      { text: 'What is an algorithm?', keywords: ['algorithm', 'steps', 'procedure', 'solution'], ideal: 'An algorithm is a defined sequence of steps to solve a problem.' },
      { text: 'Explain Big O notation in simple terms.', keywords: ['Big O', 'complexity', 'time', 'space'], ideal: 'Big O expresses how runtime or memory grows with input size.' },
      { text: 'What is a data structure?', keywords: ['data structure', 'organize', 'storage', 'access'], ideal: 'A data structure organizes data so it can be stored and accessed efficiently.' },
      { text: 'What is recursion?', keywords: ['recursion', 'self', 'base case', 'call'], ideal: 'Recursion is when a function calls itself with smaller inputs until a base case is reached.' },
      { text: 'What is a binary search?', keywords: ['binary search', 'sorted', 'divide', 'half'], ideal: 'Binary search finds a value in a sorted list by repeatedly halving the search range.' }
    ],
    Medium: [
      { text: 'Explain the difference between stack and queue.', keywords: ['stack', 'queue', 'LIFO', 'FIFO'], ideal: 'A stack is LIFO, while a queue is FIFO.' },
      { text: 'What is hashing?', keywords: ['hashing', 'hash function', 'key', 'bucket'], ideal: 'Hashing maps keys to index positions using a hash function for fast lookup.' },
      { text: 'Describe binary tree traversal orders.', keywords: ['in-order', 'pre-order', 'post-order', 'traversal'], ideal: 'Traversal orders visit nodes in different sequences: in-order, pre-order, and post-order.' },
      { text: 'What is a graph in computer science?', keywords: ['graph', 'nodes', 'edges', 'vertices'], ideal: 'A graph is a set of nodes connected by edges, modeling relationships.' },
      { text: 'What is dynamic programming?', keywords: ['dynamic programming', 'memoization', 'overlapping', 'subproblems'], ideal: 'Dynamic programming solves problems by caching results of overlapping subproblems.' }
    ],
    Hard: [
      { text: 'Explain the difference between greedy and dynamic programming.', keywords: ['greedy', 'dynamic programming', 'optimal', 'subproblem'], ideal: 'Greedy chooses local optimum each step, while dynamic programming solves overlapping subproblems for global optimum.' },
      { text: 'What is a balanced binary tree?', keywords: ['balanced', 'binary tree', 'height', 'AVL'], ideal: 'A balanced tree keeps branch heights close to avoid worst-case search times.' },
      { text: 'How does a priority queue work?', keywords: ['priority queue', 'heap', 'priority', 'extract'], ideal: 'A priority queue always removes the highest priority element first, often implemented with a heap.' },
      { text: 'Explain the difference between BFS and DFS.', keywords: ['BFS', 'DFS', 'breadth', 'depth'], ideal: 'BFS explores level by level, while DFS explores one branch deeply before backtracking.' },
      { text: 'What is memoization?', keywords: ['memoization', 'cache', 'recursion', 'performance'], ideal: 'Memoization caches function results to avoid duplicate computation in recursive algorithms.' }
    ]
  }
};

function renderQuestions(domain, difficulty) {
  const container = document.getElementById('questionGrid');
  const questions = questionBank[domain]?.[difficulty] || [];
  container.innerHTML = questions.map((item, index) => `
    <article class="question-card">
      <div class="question-header">
        <span>Question ${index + 1}</span>
        <small>${difficulty} • ${domain}</small>
      </div>
      <p>${item.text}</p>
      <label class="answer-label">Your Answer</label>
      <textarea class="answer-input" data-question-index="${index}" placeholder="Write your answer here..."></textarea>
    </article>
  `).join('');
}

function getSelectedDifficulty() {
  const pill = document.querySelector('.pill.selected');
  return pill ? pill.dataset.value : 'Easy';
}

function updateQuestionView() {
  const domain = document.getElementById('domainSelect').value;
  const difficulty = getSelectedDifficulty();
  renderQuestions(domain, difficulty);
}

const DEFAULT_MOCK_SECONDS = 180;
let mockTimerInterval = null;
let mockRemainingSeconds = DEFAULT_MOCK_SECONDS;

function formatTimer(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById('timerDisplay');
  if (timerDisplay) timerDisplay.textContent = formatTimer(mockRemainingSeconds);
}

function stopMockTimer() {
  if (mockTimerInterval) {
    clearInterval(mockTimerInterval);
    mockTimerInterval = null;
  }
  mockRemainingSeconds = DEFAULT_MOCK_SECONDS;
  updateTimerDisplay();
}

function startMockTimer() {
  stopMockTimer();
  mockTimerInterval = setInterval(() => {
    mockRemainingSeconds -= 1;
    updateTimerDisplay();
    if (mockRemainingSeconds <= 0) {
      clearInterval(mockTimerInterval);
      mockTimerInterval = null;
      alert('Time is up! Your answers will now be submitted.');
      const form = document.getElementById('mainForm');
      if (form) form.requestSubmit();
    }
  }, 1000);
}

function setTimerVisibility(show) {
  const timerBanner = document.getElementById('timerBanner');
  if (!timerBanner) return;
  if (show) {
    timerBanner.classList.remove('hidden');
    startMockTimer();
  } else {
    timerBanner.classList.add('hidden');
    stopMockTimer();
  }
}

function normalizeText(text) {
  return text.toLowerCase().replace(/[\\W_]+/g, ' ');
}

function evaluateAnswer(question, answer) {
  const normalized = normalizeText(answer);
  let score = Math.min(20 + Math.floor(answer.length / 15) * 5, 70);
  const matchedKeywords = question.keywords.filter((keyword) => normalized.includes(keyword.toLowerCase()));
  score += Math.min(matchedKeywords.length * 8, 30);
  score = Math.min(100, score);
  if (!answer.trim()) score = 0;

  const missing = question.keywords.filter((keyword) => !normalized.includes(keyword.toLowerCase()));
  const improvement = [];
  if (missing.length) improvement.push(`Mention ${missing.slice(0, 3).join(', ')}`);
  if (answer.length < 80) improvement.push('Add more detail and examples.');
  if (!normalized.includes('example')) improvement.push('Use a concrete example.');
  if (improvement.length === 0) improvement.push('Your answer is solid; add more depth for a perfect score.');

  const weakTopics = [];
  if (missing.length > 1) weakTopics.push('Key concepts');
  if (answer.length < 80) weakTopics.push('Answer depth');
  if (score < 60) weakTopics.push('Clarity and structure');

  return {
    question: question.text,
    answer,
    score,
    technical_accuracy: score > 75 ? 'Strong technical accuracy' : 'Needs improved accuracy',
    clarity: score > 65 ? 'Clear and readable' : 'Could be clearer',
    missing_points: missing.length ? missing.join(', ') : 'None',
    improvement_suggestions: improvement,
    ideal_answer: question.ideal,
    weak_topics: weakTopics
  };
}

function initMainPage() {
  const pills = document.querySelectorAll('.pill');
  const difficultyInput = document.getElementById('difficultyInput');
  const domainSelect = document.getElementById('domainSelect');
  const modeSelect = document.getElementById('modeSelect');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((other) => other.classList.remove('selected'));
      pill.classList.add('selected');
      difficultyInput.value = pill.dataset.value;
      updateQuestionView();
    });
  });

  domainSelect.addEventListener('change', updateQuestionView);
  modeSelect.addEventListener('change', () => {
    setTimerVisibility(modeSelect.value === 'Mock Interview');
  });

  setTimerVisibility(modeSelect.value === 'Mock Interview');

  document.getElementById('mainForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const domain = document.getElementById('domainSelect').value;
    const difficulty = getSelectedDifficulty();
    const mode = document.getElementById('modeSelect').value;

    if (!name || !email) {
      alert('Please enter your name and email.');
      return;
    }

    const answerNodes = document.querySelectorAll('.answer-input');
    const questions = questionBank[domain]?.[difficulty] || [];
    const evaluations = [];
    let allAnswered = true;

    answerNodes.forEach((textarea, index) => {
      const answer = textarea.value.trim();
      if (!answer) allAnswered = false;
      evaluations.push(evaluateAnswer(questions[index], answer));
    });

    if (!allAnswered) {
      if (!confirm('Some questions are unanswered. Do you want to continue anyway?')) {
        return;
      }
    }

    const totalScore = Math.round(evaluations.reduce((sum, item) => sum + item.score, 0) / evaluations.length);
    const weakTopics = [...new Set(evaluations.flatMap((item) => item.weak_topics))].filter(Boolean);

    const session = {
      name,
      email,
      domain,
      difficulty,
      mode,
      createdAt: new Date().toISOString(),
      questions: questions.map((item) => item.text),
      evaluations,
      totalScore,
      weakTopics,
      questionCount: evaluations.length
    };

    saveSession(session);
    location.href = 'result.html';
  });

  updateQuestionView();
}

function initResultPage() {
  const session = getSession();
  if (!session) {
    document.getElementById('summaryLine').innerText = 'No session data found. Start a new interview first.';
    return;
  }

  document.getElementById('finalScore').innerText = `${session.totalScore}%`;
  document.getElementById('totalQuestions').innerText = session.questionCount;
  document.getElementById('averageScore').innerText = `${session.totalScore}%`;
  document.getElementById('summaryWeakTopics').innerText = session.weakTopics.length ? session.weakTopics.join(', ') : 'None';

  const feedbackItems = session.evaluations.map((evaluation, index) => `
    <div class="evaluation-block">
      <h3>Question ${index + 1} score: ${evaluation.score}%</h3>
      <div class="evaluation-row"><strong>Technical:</strong> ${evaluation.technical_accuracy}</div>
      <div class="evaluation-row"><strong>Clarity:</strong> ${evaluation.clarity}</div>
      <div class="evaluation-row"><strong>Missing:</strong> ${evaluation.missing_points}</div>
      <div class="evaluation-row"><strong>Improvement:</strong><ul>${evaluation.improvement_suggestions.map(item => `<li>${item}</li>`).join('')}</ul></div>
    </div>
  `).join('');

  document.getElementById('resultFeedback').innerHTML = feedbackItems;

  const weakAreas = session.weakTopics && session.weakTopics.length ? session.weakTopics : ['No weak areas detected yet.'];
  document.getElementById('weakAreas').innerHTML = weakAreas.map((topic) => `<span class="weak-pill">${topic}</span>`).join('');

  document.getElementById('restartInterviewBtn').addEventListener('click', () => {
    location.href = 'index.html';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (pageName === '' || pageName === 'index.html') {
    initMainPage();
  }
  if (pageName === 'result.html') {
    initResultPage();
  }
});
