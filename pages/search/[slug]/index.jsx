import React from "react";
import { useRouter } from "next/router";
import Footer from "../../../components/Footer/Footer";
import Nav from "../../../components/Nav/Nav";
import Search from "../../../components/Search";

const SearchPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  console.log(slug);
  return (
    <div style={{ backgroundColor: "#f7f8fa" }}>
      <Nav color="#c9184a" />
      <Search filter={slug} />
      <Footer />
    </div>
  );
};

export default SearchPage;
