const SECAI_V2_ADDITIONS = [
  [1,"1","Supervised learning","A security team has malware samples labeled by family and wants a model to classify new samples into those known families. Which learning approach is most appropriate?",["Unsupervised learning","Supervised learning","Reinforcement learning","Federated learning"],"B"],
  [2,"1","Unsupervised clustering","A security team has thousands of unlabeled authentication events and wants to identify groups of similar behavior without predefined categories. Which technique is most appropriate?",["Regression","Classification","Clustering","Reinforcement learning"],"C"],
  [3,"1","Reinforcement learning","An AI system adjusts intrusion-detection thresholds based on rewards for detecting attacks while minimizing false positives. Which learning approach is being used?",["Transfer learning","Reinforcement learning","Unsupervised learning","Self-supervised learning"],"B"],
  [4,"1","Overfitting","A malware classifier performs nearly perfectly on its training set but poorly on previously unseen samples. Which condition most likely occurred?",["Data minimization","Underfitting","Tokenization","Overfitting"],"D"],
  [5,"1","Retrieval-augmented generation","An internal chatbot must answer from current company procedures without retraining the underlying language model whenever a procedure changes. Which architecture best meets this requirement?",["Model inversion","Retrieval-augmented generation","Reinforcement learning","Dimensionality reduction"],"B"],
  [6,"1","Embeddings","A system converts document passages into numerical vectors so semantically similar passages can be retrieved. What is the system creating?",["Embeddings","Labels","Hyperparameters","Signatures"],"A"],
  [7,"1","Precision","A detection model identifies 100 files as malicious, but 35 are actually benign. Which metric is most directly reduced?",["Recall","Availability","Precision","Explainability"],"C"],
  [8,"1","Recall","A phishing model detects only 60 of 100 actual phishing messages but produces few false positives. Which metric is most directly deficient?",["Precision","Recall","Specificity","Calibration"],"B"],
  [9,"1","Generative AI agents","An AI assistant can search tickets, reset passwords, and disable accounts rather than only generate text. Which capability creates the greatest additional risk?",["Model compression","Excessive agency","Tokenization","Dimensionality reduction"],"B"],
  [10,"1","Few-shot prompting","A developer includes several examples of correctly formatted incident summaries in a prompt before requesting a new summary. Which prompting technique is being used?",["Zero-shot prompting","Chain-of-thought disclosure","Few-shot prompting","Adversarial training"],"C"],
  [61,"2","Training-data poisoning","An attacker inserts carefully crafted malicious records into a model's training data so a specific trigger causes misclassification after deployment. Which attack is occurring?",["Model extraction","Training-data poisoning","Membership inference","Prompt leaking"],"B"],
  [62,"2","Least privilege for AI agents","An AI agent can create users, modify firewall rules, and delete cloud resources, although its assigned task requires only reading alerts. Which control best reduces the risk?",["Increase the context window","Grant a shared administrator account","Apply least privilege to tools and service identities","Disable model monitoring"],"C"],
  [63,"2","Model and data provenance","A security team must verify where a downloaded model, its training data, and supporting libraries originated before deployment. Which capability is most important?",["Model and data provenance records","Higher inference throughput","Longer prompts","Lower temperature"],"A"],
  [64,"2","Secure sandboxing","A company allows an AI coding assistant to execute generated code for testing. Which control most directly limits damage from malicious or unsafe output?",["Execute with production credentials","Run code in an isolated sandbox with restricted permissions","Disable audit logs","Increase model parameters"],"B"],
  [65,"3","AI-assisted threat hunting","A threat hunter wants AI to identify unusual combinations of process, network, and identity activity that do not match existing signatures. Which use case best fits?",["Automated evidence destruction","Behavioral anomaly detection","Static asset inventory","Password rotation"],"B"],
  [66,"3","Human validation of generated queries","An AI assistant converts analyst questions into SIEM queries. What should occur before a high-impact query is executed across production data?",["Validate scope, syntax, and authorization","Disable query logging","Give the assistant unrestricted access","Trust the query because it was model-generated"],"A"],
  [67,"3","Synthetic-content detection limits","A security team deploys an AI detector to identify synthetic phishing messages. Which limitation should analysts account for?",["Detection results are probabilistic and can produce false positives and false negatives","The detector guarantees attribution to a specific actor","The detector eliminates the need for email telemetry","The detector cannot be monitored"],"A"],
  [68,"3","Incident-response prioritization","During a widespread incident, an AI system ranks affected hosts for containment. Which inputs provide the best basis for prioritization?",["Host naming convention only","Asset criticality, observed behavior, exposure, and confidence","Number of installed applications","Alphabetical order"],"B"],
  [69,"4","Model cards and system documentation","An auditor needs a concise record of a model's intended use, limitations, evaluation results, and known risks. Which artifact best supports this request?",["Firewall rule set","Model card","Source-code checksum only","Prompt transcript only"],"B"],
  [70,"4","Risk acceptance authority","A business unit wants to deploy an AI system despite a documented residual risk that exceeds the team's normal tolerance. Who should approve the decision?",["Any developer on the project","The model vendor","An authorized risk owner","The first end user"],"C"]
];

const base = window.SECAI_QUESTION_BANK;
if (!base || !Array.isArray(base.questions)) throw new Error('SecAI+ base question bank did not load.');
const additions = SECAI_V2_ADDITIONS.map(([number,domain,target,stem,choices,answer])=>({
  id:`Q${String(number).padStart(3,'0')}`,
  number,
  domain,
  target,
  stem,
  options:Object.fromEntries(['A','B','C','D'].map((key,index)=>[key,choices[index]])),
  answer
}));
window.SECAI_QUESTION_BANK = {
  schemaVersion: 1,
  bankId: 'secai-plus-cy0-001-v2',
  bankVersion: '2.0.0',
  title: 'CompTIA SecAI+ CY0-001 Diagnostic v2',
  questions: [...base.questions, ...additions].sort((a,b)=>a.number-b.number)
};