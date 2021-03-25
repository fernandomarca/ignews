import { GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../Components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";

//client-side-rendering - CSR - DINÂMICO SEM NECESSIDADE DE SEO
//server-side-rendering - SSR - SEO-DINÂMICO ESPECÍFICOS DIFERENTES A CADA SOLICITAÇÃO
//static-Site-Generation - SSG - SEO-PERFORMANCE SEM DADOS DINÂMICOS, REVALIDADOS A UM CERTO TEMPO
interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1IYcslEyWhmwCHewiK3MD1w7", {
    expand: ["product"],
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };
  return {
    props: { product },
    revalidate: 60 * 60 * 24, //24 hours = 1 dia
  };
};
