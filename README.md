docker run -it -e AGENT_NAME=au007 -e AGENT_PASSWORD=au007MIMA acccptest_agent

To launch a few agent
docker-compose run --rm -e AGENT_NAME=au007 -e AGENT_PASSWORD=au007MIMA  agent node auto_agent.js
docker-compose run --rm -e AGENT_NAME=au008 -e AGENT_PASSWORD=au008MIMA  agent node auto_agent.js