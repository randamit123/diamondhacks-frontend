# Project: Resign
**Sign language to text web app.** 

## Contributions
*Since we swapped around computers while working on the project, the commits don't accurately reflect the commits. This section is tended to outline our contributions.*

**Amit Rand:** I spearheaded the project from inception to execution. I conceptualized the idea, planned the technological stack, and designed the architecture and infrastructure. Taking charge of development, I crafted a robust data collection system leveraging OpenCV to gather videos for model training. Additionally, I engineered an LSTM-based sign language-to-text model entirely from the ground up, employing cutting-edge tools such as TensorFlow, Keras, OpenCV, and MediaPipe. I  integrated the model into both backend systems and local APIs, facilitating smooth communication of results between the front end and back end. I also assisted in debugging any issues encountered with our technologies ranging from our Next.js framework to TypeScript syntax and GitHub source management. Furthermore, I enhanced the project's capabilities by integrating text-to-speech functionalities using Elevenlabs.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
