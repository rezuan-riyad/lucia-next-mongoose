This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Create Google Client Id and Client Secret 
1. Create a new google cloud project. [Visit Cloud Console](https://console.cloud.google.com)
2. Configure OAuth Consent Screeen. [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
3. Visit [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials) and create new credentials. Get client Id and client secret

Watch on Youtube [Create Google Client ID and Client Secret](https://www.youtube.com/watch?v=GgZg-4yIVUI)

## Run Dev Server
Before running dev server, you need to make sure you've set **MONGODB_URI** env variable.
Now,
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Try login with google, [http://localhost:3000/login](http://localhost:3000/login).