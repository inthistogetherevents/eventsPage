import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import isBefore from "date-fns/is_before";
import endOfDay from "date-fns/end_of_day"
import ReactMarkdown from "react-markdown";

import MeetupTemplate from "./meetup";
import Layout from "../components/Layout";
import HTMLContent from "../components/Content";
import "../styles/past-meetups-page.scss";

export const RedirectTemplate = ({
  title,
  content,
  bodyIsMarkdown = false,
}) => {
  return (
    <article className="redirect">
      <div className="container  redirect-container">
        <h1 className="redirect-title">{title}</h1>
        {bodyIsMarkdown ? (
          <ReactMarkdown className="redirect-description" source={content} />
        ) : (
          <HTMLContent className="redirect-description" content={content} />
        )}
      </div>
    </article>
  );
};

RedirectTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  meetups: PropTypes.array,
};

const Redirect = ({ data }) => {
  const { markdownRemark: page } = data;
  const {
    frontmatter: {
      seo: { title: seoTitle, description: seoDescription, browserTitle },
      redirect_url
    },
  } = page;

  return (
    <Layout footerData={data.footerData} navbarData={data.navbarData}>
        <Helmet>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SR60NQ9CMJ"></script>
        <script dangerouslySetInnerHTML= {{ __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-SR60NQ9CMJ');`}} />  
        <meta name="title" content={seoTitle} />
        <meta name="og:title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="og:description" content={seoDescription} />
        <title>{browserTitle}</title>
        <meta
            http-equiv="refresh"
            content={`0;url=${redirect_url}`}
        />
      </Helmet>
    </Layout>
  );
};

Redirect.propTypes = {
  data: PropTypes.object.isRequired,
  redirect_url: PropTypes.object.isRequired,
};

export default Redirect;

export const RedirectQuery = graphql`
  query Redirect($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        redirect_url
        seo {
          browserTitle
          title
          description
        }
      }
    }
  }
`;
