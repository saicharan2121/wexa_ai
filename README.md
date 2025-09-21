# wexa_ai
WEXA AI assignment about the Prompt engineering assignment where the input would be a ticket by a user CRUD operations and the ai would give reply based on confident score or assign it to a human agent and output would be a resolved or not or text format


Title and intro


    Wexa Helpdesk (Node/Express + Mongo + React)

    Features: Auth with JWT, Tickets (create/list/view/status/comment), Articles (CRUD + publish), Agent Suggestions (AI stub storing suggestions with outcomes), Admin Config (admin-only settings).

Run locally

    Server:

cd server

cp .env.example .env

npm install

npm run dev

    Client:

cd client

echo REACT_APP_API_URL=http://localhost:8080 > .env

npm install

npm start

    Login:

email: admin@wexa.com

password: admin123

Run with Docker

        At repo root:

            docker compose up

        Open:

            API health: http://localhost:8080/healthz

            Client: http://localhost:3000 (if you later add a client service; otherwise the client runs with npm start)

First login: admin@wexa.com / admin123

API highlights
Auth: POST /api/auth/login (returns token).

Tickets: POST /api/tickets, GET /api/tickets, GET /api/tickets/:id, PATCH status/assign/comment.

Articles: POST /api/articles, GET /api/articles, GET /api/articles/:id, PATCH /publish, PATCH /unpublish, DELETE.

Agent: POST /api/agent/:ticketId/suggestions, GET /api/agent/:ticketId/suggestions, PATCH /api/agent/suggestions/:id/outcome.

Config: GET /api/config (any auth), PATCH /api/config (admin only).


AI note
    Agent Suggestions implement the AI workflow as a stub: the endpoint accepts prompt/suggestion/confidence and stores them; the external LLM call can be plugged in later.


    Sorry you need a homework so the images from the thunderclient i have taken screenshots you can check them out series wise which includes
        - login and registratoin of the user 
        - ticket creation listing get push patch and delete also
        - ai agent stub mode and list get and update
        - article creation list update status and delete also
        -api configuration and tickets also 

    i kindly request you to check that all images you will get to know what i am capable of!! 

Thankyou!.
