import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Builder from "../src/components/Builder/Builder";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Builder isPreview={false} isThankYou={false} builder={{}} />
    </div>
  );
};

export default Home;
