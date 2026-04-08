cd saas-backend
docker-compose up -d
ngrok http 3001

npx prisma generate 

npm run dev


cd agent-orchestrator
npx openclaw onboard

npx openclaw agents add SaaS-Router --workspace ./workspace
npx openclaw gateway 

npx openclaw gateway stop

npx openclaw agent --agent SaaS-Router --message "Hi, I am interested in the enterprise plan for my team of 250. My email is test@ceo.com and our use case is automated support." --local