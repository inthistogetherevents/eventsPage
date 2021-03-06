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

export const PastMeetupsPageTemplate = ({
  title,
  content,
  meetups = null,
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
        {meetups &&
          meetups.map((meetup, index) => (
            <MeetupTemplate
              key={index}
              className="pastMeetups-meetup"
              meetup={meetup.node.frontmatter}
            />
          ))}
      </div>
    </article>
  );
};

PastMeetupsPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  meetups: PropTypes.array,
};

const PastMeetupsPage = ({ data }) => {
  const { markdownRemark: page } = data;
  const {
    frontmatter: {
      seo: { title: seoTitle, description: seoDescription, browserTitle },
    },
  } = page;
  let meetups = data.allMarkdownRemark.edges;

  // Find all the meetups that occured in the past
  meetups = meetups.filter(meetup => {
    return isBefore(endOfDay(meetup.node.frontmatter.rawDate), new Date()) && meetup;
  });

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
      <PastMeetupsPageTemplate
        title={page.frontmatter.title}
        content={page.html}
        meetups={meetups}
      />
    </Layout>
  );
};

PastMeetupsPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default PastMeetupsPage;

export const pastMeetupsPageQuery = graphql`
  query PastMeetupsPage($id: String!) {
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
      filter: { frontmatter: { presenters: { elemMatch: { text: { ne: null } } } } }
      sort: { order: DESC, fields: frontmatter___date }
    ) {
      edges {
        node {
          frontmatter {
            title
            formattedDate: date(formatString: "MMMM Do YYYY @ h:mm A")
            rawDate: date
            virtual
            eventImg
            presenters {
              name
              image
              text
              presentationTitle
              links {
                linkText
                linkURL
              }
            }
            location {
              mapsLatitude
              mapsLongitude
              mapsLink
              name
            }
            stream {
              streamProvider
              streamChannel
              streamLink
            }
          }
        }
      }
    }
  }
`;
