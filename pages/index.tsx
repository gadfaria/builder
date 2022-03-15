import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Builder from "../src/components/Builder/Builder";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const BUILDER = {
    name: "TEST BUILDER",
    url: "WWW.GOOGLE.COM",
    createdAt: new Date(),
  };

  return (
    <div>
      <Builder isPreview={false} isThankYou={false} builder={BUILDER} />
    </div>
  );
};

export default Home;
