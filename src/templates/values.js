import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import isBefore from "date-fns/is_before";
import endOfDay from "date-fns/end_of_day"
import ReactMarkdown from "react-markdown";

import ValueTemplate from "./value";
import Layout from "../components/Layout";
import HTMLContent from "../components/Content";
import "../styles/past-meetups-page.scss";

export const ValuesTemplate = ({
  title,
  content,
  values = null,
  bodyIsMarkdown = false,
}) => {
  return (
    <article className="pastMeetups">
      <div className="container  pastMeetups-container">
        <h1 className="pastMeetups-title">{title}</h1>
        {bodyIsMarkdown ? (
          <ReactMarkdown className="pastMeetups-description" source={content} />
        ) : (
          <HTMLContent className="pastMeetups-description" content={content} />
        )}
        {values &&
          values.map((value, index) => (
            <ValueTemplate
              key={index}
              className="values-value"
              value={value.node.frontmatter}
            />
          ))}
      </div>
    </article>
  );
};

ValuesTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  values: PropTypes.array,
};

const Values = ({ data }) => {
  const { markdownRemark: page } = data;
  const {
    frontmatter: {
      seo: { title: seoTitle, description: seoDescription, browserTitle },
    },
  } = page;
  let values = data.allMarkdownRemark.edges;

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
        <meta name="description" content={seoDescription} />
        <title>{browserTitle}</title>
      </Helmet>
      <ValuesTemplate
        title={page.frontmatter.title}
        content={page.html}
        values={values}
      />
    </Layout>
  );
};

Values.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Values;

export const valuesQuery = graphql`
  query Values($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        seo {
          browserTitle
          title
          description
        }
      }
    }
    ...LayoutFragment
    allMarkdownRemark(
      filter: { frontmatter: { value_name: { ne: null } } }
      sort: { order: DESC, fields: frontmatter___date }
    ) {
      edges {
        node {
          frontmatter {
            value_name
            value_desc
          }
        }
      }
    }
  }
`;
