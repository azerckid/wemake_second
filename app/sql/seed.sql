-- Seed data for the wemake database
-- Using profile_id: 67ac33ac-e49c-4c36-8d71-f12fdaea0e4f

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Web Development', 'Web applications and websites'),
('Mobile Apps', 'iOS and Android applications'),
('AI/ML', 'Artificial Intelligence and Machine Learning projects'),
('DevTools', 'Developer tools and utilities'),
('SaaS', 'Software as a Service applications');

-- Insert topics
INSERT INTO topics (name, slug) VALUES
('General Discussion', 'general-discussion'),
('Product Showcase', 'product-showcase'),
('Job Opportunities', 'job-opportunities'),
('Technical Help', 'technical-help'),
('Community Events', 'community-events');

-- Insert jobs
INSERT INTO jobs (position, overview, responsibilities, qualifications, benefits, skills, company_name, company_logo, company_location, apply_url, job_type, location, salary_range) VALUES
('Senior Full Stack Developer', 'Join our innovative team building the future of web development', 'Lead development of new features, mentor junior developers, architect scalable solutions', '5+ years experience, React/Node.js expertise, team leadership skills', 'Competitive salary, health insurance, remote work, stock options', 'React, Node.js, PostgreSQL, AWS, TypeScript', 'TechCorp Inc', 'https://example.com/logo1.png', 'San Francisco, CA', 'https://techcorp.com/careers', 'full-time', 'remote', '$120,000 - $150,000'),
('Frontend Developer', 'Create beautiful user interfaces for our next-generation platform', 'Build responsive UIs, optimize performance, collaborate with design team', '3+ years frontend experience, modern JavaScript frameworks', 'Flexible hours, learning budget, great team culture', 'React, Vue.js, CSS, HTML, JavaScript', 'DesignStudio', 'https://example.com/logo2.png', 'New York, NY', 'https://designstudio.com/jobs', 'full-time', 'hybrid', '$70,000 - $100,000'),
('Backend Engineer', 'Scale our infrastructure to support millions of users', 'Design APIs, optimize database performance, ensure system reliability', '4+ years backend experience, database expertise, cloud platforms', 'Health benefits, 401k, professional development', 'Python, PostgreSQL, AWS, Docker, Kubernetes', 'DataFlow Systems', 'https://example.com/logo3.png', 'Austin, TX', 'https://dataflow.com/careers', 'full-time', 'in-person', '$100,000 - $120,000'),
('DevOps Engineer', 'Automate and optimize our deployment pipeline', 'Manage CI/CD, monitor systems, ensure security compliance', '3+ years DevOps experience, automation tools, cloud platforms', 'Remote work, competitive salary, growth opportunities', 'Docker, Kubernetes, AWS, Terraform, Jenkins', 'CloudScale', 'https://example.com/logo4.png', 'Seattle, WA', 'https://cloudscale.com/jobs', 'full-time', 'remote', '$100,000 - $120,000'),
('Product Manager', 'Drive product strategy and roadmap for our flagship product', 'Define requirements, coordinate teams, analyze user feedback', '5+ years PM experience, technical background, leadership skills', 'Stock options, health insurance, flexible schedule', 'Product strategy, Agile, user research, analytics', 'ProductVision', 'https://example.com/logo5.png', 'Boston, MA', 'https://productvision.com/careers', 'full-time', 'hybrid', '$120,000 - $150,000');

-- Insert products
INSERT INTO products (name, tagline, description, how_it_works, icon, url, stats, profile_id, category_id) VALUES
('CodeFlow', 'Streamline your development workflow', 'A comprehensive IDE extension that automates common development tasks and improves code quality', 'Install the extension, configure your preferences, and let CodeFlow handle the rest with intelligent automation', 'https://example.com/codeflow-icon.png', 'https://codeflow.dev', '{"views": 1250, "reviews": 45}', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 4),
('TaskMaster', 'Project management made simple', 'An intuitive project management tool that helps teams collaborate effectively and track progress', 'Create projects, assign tasks, set deadlines, and track progress with our intuitive dashboard', 'https://example.com/taskmaster-icon.png', 'https://taskmaster.app', '{"views": 890, "reviews": 32}', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 5),
('DataViz Pro', 'Transform data into insights', 'Advanced data visualization tool that helps businesses understand their data through interactive charts', 'Upload your data, choose visualization types, customize appearance, and share insights with your team', 'https://example.com/dataviz-icon.png', 'https://datavizpro.com', '{"views": 2100, "reviews": 78}', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 3),
('CloudSync', 'Seamless cloud storage solution', 'Secure cloud storage with advanced sync capabilities and collaboration features', 'Upload files, organize in folders, share with team members, and access from any device', 'https://example.com/cloudsync-icon.png', 'https://cloudsync.io', '{"views": 3400, "reviews": 156}', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 5),
('API Gateway', 'Centralized API management', 'Enterprise-grade API gateway that provides security, monitoring, and rate limiting for your APIs', 'Configure your APIs, set up security policies, monitor traffic, and manage access controls', 'https://example.com/apigateway-icon.png', 'https://apigateway.enterprise', '{"views": 980, "reviews": 23}', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 1);

-- Insert reviews
INSERT INTO reviews (product_id, profile_id, rating, review) VALUES
(1, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 5, 'CodeFlow has revolutionized my development workflow. The automation features save me hours every day.'),
(2, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 4, 'TaskMaster is intuitive and easy to use. Great for team collaboration and project tracking.'),
(3, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 5, 'DataViz Pro makes complex data analysis simple. The visualizations are beautiful and informative.'),
(4, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 4, 'CloudSync provides reliable storage with excellent sync capabilities. Highly recommended.'),
(5, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 3, 'API Gateway is powerful but has a steep learning curve. Once configured, it works well.');

-- Insert product upvotes (composite primary key table)
INSERT INTO product_upvotes (product_id, profile_id) VALUES
(1, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
(2, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
(3, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f');

-- Insert gpt_ideas
INSERT INTO gpt_ideas (idea, views, claimed_at, claimed_by) VALUES
('AI-powered code review assistant that automatically detects bugs and suggests improvements', 1250, NULL, NULL),
('Blockchain-based voting system for transparent elections', 890, '2024-01-15 10:30:00', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
('AR shopping app that lets you try on clothes virtually', 2100, NULL, NULL),
('Smart home automation system controlled by voice commands', 1560, '2024-02-20 14:45:00', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
('AI chatbot for mental health support and therapy sessions', 3200, NULL, NULL);

-- Insert gpt_ideas_likes (composite primary key table)
INSERT INTO gpt_ideas_likes (gpt_idea_id, profile_id) VALUES
(1, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
(2, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
(3, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f');

-- Insert posts
INSERT INTO posts (title, content, topic_id, profile_id) VALUES
('Best Practices for React Performance Optimization', 'Here are some proven techniques to optimize React applications for better performance...', 4, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
('Showcasing My Latest Project: TaskMaster', 'I''m excited to share TaskMaster, a project management tool I''ve been working on...', 2, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
('Looking for Frontend Developer Position', 'Experienced React developer seeking new opportunities in innovative companies...', 3, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
('Community Hackathon Results', 'Amazing turnout at our latest hackathon! Here are the winning projects...', 5, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
('Database Design Patterns Discussion', 'Let''s discuss different database design patterns and when to use each...', 4, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f');

-- Insert post_replies
INSERT INTO post_replies (post_id, parent_id, profile_id, reply) VALUES
(1, NULL, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'Great tips! I especially found the memoization section helpful.'),
(1, NULL, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'Thanks for sharing. Have you tried React.memo for functional components?'),
(2, NULL, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'This looks amazing! What tech stack did you use?'),
(3, NULL, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'I''m interested in this position. Can you share more details?'),
(4, NULL, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'Congratulations to all participants! The projects were impressive.');

-- Insert post_upvotes (composite primary key table)
INSERT INTO post_upvotes (post_id, profile_id) VALUES
(1, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
(2, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
(3, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f');

-- Insert team
INSERT INTO team (product_name, team_size, equity_split, product_stage, roles, product_description) VALUES
('EcoTracker', 4, 25, 'mvp', 'Frontend Developer, Backend Engineer, UI/UX Designer, Product Manager', 'Environmental monitoring platform for tracking carbon footprint'),
('HealthConnect', 6, 20, 'prototype', 'Full Stack Developer, Mobile Developer, Data Scientist, DevOps Engineer, Marketing Specialist, Business Analyst', 'Telemedicine platform connecting patients with healthcare providers'),
('EduTech Pro', 3, 30, 'idea', 'Lead Developer, Designer, Marketing Lead', 'AI-powered personalized learning platform for students'),
('FinanceFlow', 5, 22, 'product', 'Senior Developer, Junior Developer, Designer, QA Engineer, Product Owner', 'Personal finance management app with investment tracking'),
('SocialVibe', 7, 18, 'mvp', 'Frontend Developer, Backend Developer, Mobile Developer, Designer, Marketing, Community Manager, Data Analyst', 'Social networking platform focused on professional connections');

-- Insert message_rooms
INSERT INTO message_rooms DEFAULT VALUES;
INSERT INTO message_rooms DEFAULT VALUES;
INSERT INTO message_rooms DEFAULT VALUES;

-- Insert message_room_members (composite primary key table)
INSERT INTO message_room_members (message_room_id, profile_id) VALUES
(1, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
(2, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f'),
(3, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f');

-- Insert messages
INSERT INTO messages (message_room_id, sender_id, content) VALUES
(1, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'Hey everyone! How is the project going?'),
(1, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'We should schedule a meeting to discuss the next phase.'),
(2, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'The new features are looking great!'),
(3, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'Thanks for the feedback on the design mockups.');

-- Insert notifications
INSERT INTO notifications (source_id, product_id, post_id, target_id, type) VALUES
('67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 1, NULL, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'review'),
('67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NULL, 1, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'reply'),
('67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NULL, 2, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'mention'),
('67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 2, NULL, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'follow'),
('67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NULL, 3, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 'reply');

-- Insert TODAY's data (created_at = NOW())
-- Today's Products
INSERT INTO products (name, tagline, description, how_it_works, icon, url, stats, profile_id, category_id, created_at) VALUES
('AI Writer Pro', 'AI-powered writing assistant for professionals', 'Create high-quality content faster with AI assistance that understands context and tone', 'Type your ideas, let AI refine and enhance your content with intelligent suggestions', 'https://example.com/aiwriter-icon.png', 'https://aiwriter.pro', '{"views": 850, "reviews": 32, "upvotes": 45}', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 5, NOW()),
('CodeReview AI', 'Automated code review with AI insights', 'Get instant code quality feedback and security recommendations', 'Connect your repository, AI analyzes every commit for best practices', 'https://example.com/codereview-icon.png', 'https://codereview.ai', '{"views": 1200, "reviews": 28, "upvotes": 67}', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 4, NOW()),
('DesignSprint', 'Collaborative design tool for teams', 'Real-time design collaboration with built-in version control', 'Invite your team, design together in real-time, iterate faster', 'https://example.com/designsprint-icon.png', 'https://designsprint.io', '{"views": 950, "reviews": 41, "upvotes": 52}', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 1, NOW()),
('Analytics Hub', 'Unified analytics dashboard for all your tools', 'Connect all your analytics tools in one place, get insights instantly', 'Connect your tools, configure dashboards, start tracking metrics', 'https://example.com/analytics-icon.png', 'https://analyticshub.com', '{"views": 1100, "reviews": 55, "upvotes": 78}', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 5, NOW()),
('CloudDeploy', 'One-click deployment to multiple clouds', 'Deploy to AWS, GCP, Azure from a single interface', 'Choose your target cloud, configure settings, deploy with one click', 'https://example.com/clouddeploy-icon.png', 'https://clouddeploy.dev', '{"views": 760, "reviews": 23, "upvotes": 34}', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 4, NOW()),
('TeamChat Plus', 'Enhanced team communication platform', 'Modern chat with voice, video, and screen sharing built-in', 'Start a workspace, invite your team, communicate seamlessly', 'https://example.com/teamchat-icon.png', 'https://teamchat.plus', '{"views": 890, "reviews": 36, "upvotes": 48}', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 5, NOW()),
('DataSync Pro', 'Automated data synchronization across platforms', 'Sync data between your tools automatically, eliminate manual work', 'Connect your apps, set sync rules, automate data flow', 'https://example.com/datasync-icon.png', 'https://datasync.pro', '{"views": 1020, "reviews": 49, "upvotes": 61}', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', 4, NOW());

-- Today's Posts
INSERT INTO posts (title, content, topic_id, profile_id, created_at) VALUES
('Getting Started with React Server Components', 'React Server Components are revolutionizing how we build React applications. Let me share my experience...', 4, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW()),
('Showcase: AI Writer Pro - My Latest Project', 'I''ve been working on AI Writer Pro for the past 6 months. It''s an AI-powered writing assistant...', 2, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW()),
('Hiring: Senior Full Stack Developer (Remote)', 'We''re looking for an experienced full stack developer to join our growing team...', 3, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW()),
('Latest Trends in Web3 Development', 'Web3 development is rapidly evolving. Let''s discuss the latest trends and tools...', 4, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW()),
('Community Feedback Needed: Feature Requests', 'We''re planning our next sprint and would love your input on what features matter most...', 1, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW()),
('TypeScript Tips: Advanced Patterns', 'I''ve compiled some advanced TypeScript patterns that have saved me countless hours...', 4, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW()),
('Upcoming Online Hackathon: Details Inside', 'Mark your calendars! We''re hosting an online hackathon next month with great prizes...', 5, '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW());

-- Today's Jobs
INSERT INTO jobs (position, overview, responsibilities, qualifications, benefits, skills, company_name, company_logo, company_location, apply_url, job_type, location, salary_range, created_at) VALUES
('Senior React Developer', 'Build cutting-edge React applications with the latest features', 'Develop React components, optimize performance, mentor junior developers', '5+ years React experience, TypeScript, state management expertise', 'Remote work, unlimited PTO, learning budget, competitive salary', 'React, TypeScript, Next.js, GraphQL', 'ReactHub', 'https://example.com/reacthub-logo.png', 'Remote', 'https://reacthub.com/jobs', 'full-time', 'remote', '$130,000 - $160,000', NOW()),
('DevOps Specialist', 'Manage cloud infrastructure and CI/CD pipelines', 'Design scalable systems, automate deployments, monitor services', '3+ years DevOps, Kubernetes, AWS/GCP experience', 'Health insurance, 401k, stock options, flexible hours', 'Docker, Kubernetes, Terraform, AWS, Jenkins', 'CloudScale Inc', 'https://example.com/cloudscale-logo.png', 'San Francisco, CA', 'https://cloudscale.com/careers', 'full-time', 'hybrid', '$110,000 - $140,000', NOW()),
('Product Designer', 'Create beautiful and intuitive user experiences', 'Design user interfaces, conduct user research, collaborate with engineers', '4+ years design experience, Figma, user research skills', 'Design budget, conference tickets, remote flexible', 'Figma, Adobe XD, User Research, Prototyping', 'DesignFirst', 'https://example.com/designfirst-logo.png', 'New York, NY', 'https://designfirst.com/jobs', 'full-time', 'hybrid', '$90,000 - $120,000', NOW()),
('Machine Learning Engineer', 'Build AI/ML solutions for enterprise clients', 'Develop ML models, deploy to production, optimize performance', 'PhD or Masters in CS/Math, TensorFlow/PyTorch, MLOps', 'Research budget, publication support, equity package', 'Python, TensorFlow, PyTorch, MLOps, Kubernetes', 'AI Solutions Lab', 'https://example.com/aisolutions-logo.png', 'Boston, MA', 'https://aisolutions.com/careers', 'full-time', 'remote', '$150,000 - $200,000', NOW()),
('Mobile Developer (iOS/Android)', 'Create native mobile apps for iOS and Android', 'Develop mobile apps, optimize performance, collaborate with design team', '3+ years mobile dev, Swift/Kotlin, React Native', 'Device budget, app store credits, gym membership', 'Swift, Kotlin, React Native, iOS, Android', 'MobileWorks', 'https://example.com/mobileworks-logo.png', 'Austin, TX', 'https://mobileworks.com/jobs', 'full-time', 'hybrid', '$100,000 - $130,000', NOW());

-- Today's Teams
INSERT INTO teams (product_name, team_size, equity_split, product_stage, roles, product_description, team_leader_id, created_at) VALUES
('DevTools Platform', 3, 30, 'mvp', 'Full Stack Developer, DevOps Engineer, Product Manager', 'Unified platform for developer tools and integrations', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW()),
('AI Commerce', 5, 22, 'prototype', 'Backend Developer, AI/ML Engineer, Frontend Developer, Data Scientist, Product Designer', 'AI-powered e-commerce personalization platform', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW()),
('EdTech Platform', 4, 25, 'idea', 'Full Stack Developer, UI/UX Designer, Content Creator, Marketing Lead', 'Online learning platform with gamification', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW()),
('HealthTech App', 6, 18, 'mvp', 'Mobile Developer, Backend Engineer, Health Data Specialist, Designer, QA Engineer, Product Manager', 'Health tracking and wellness management app', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW()),
('FinTech Solution', 5, 20, 'product', 'Senior Backend Developer, Frontend Developer, Security Engineer, DevOps, Business Analyst', 'Secure payment processing and financial analytics', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW()),
('Social Network', 4, 28, 'prototype', 'Full Stack Developer, Mobile Developer, Designer, Community Manager', 'Professional networking platform for creatives', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW()),
('EcoTech', 3, 35, 'idea', 'Lead Developer, Designer, Sustainability Advisor', 'Platform for tracking and reducing carbon footprint', '67ac33ac-e49c-4c36-8d71-f12fdaea0e4f', NOW());

-- Today's GPT Ideas
INSERT INTO gpt_ideas (idea, views, claimed_at, claimed_by, created_at) VALUES
('AI-powered virtual interior designer that generates room layouts based on user preferences', 850, NULL, NULL, NOW()),
('Blockchain-based supply chain transparency platform for ethical sourcing', 1200, NULL, NULL, NOW()),
('Voice-controlled smart office system for productivity management', 950, NULL, NULL, NOW()),
('AI fitness trainer app with real-time form correction using computer vision', 1100, NULL, NULL, NOW()),
('Peer-to-peer solar energy trading platform using smart contracts', 780, NULL, NULL, NOW()),
('AR-based language learning app with immersive conversation practice', 1400, NULL, NULL, NOW()),
('AI-powered meal planning app that considers dietary restrictions and budget', 920, NULL, NULL, NOW());
