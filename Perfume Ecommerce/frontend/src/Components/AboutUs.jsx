import { useState, useEffect, useRef } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Header from './SubComponents/Header';
import '../css/style.css'
import Iframe from 'react-iframe';
import Footer from './SubComponents/Footer';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:4444';
const Image_Path_URL = 'http://localhost:4444/public/AllProducts/';

const AboutUsContainer = styled.div`



* {
    margin: 0;
    padding: 0;
  }
  
  html,body{
    box-sizing: border-box;
    font-style: normal;
    scroll-behavior: smooth;
  }
  
  .images-icon {
    height: 100%;
    width: 100%;
    max-width: 100%;
    object-fit: contain;
    position: absolute;
    left: -8.437rem;
    top: 0;
    transform: scale(1.544);
  }
  .wrapper-images {
    height: 33.188rem;
    width: 25rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pattern {
    height: 1.438rem;
    width: 0.25rem;
    background: linear-gradient(94.06deg, #ffb62a, #ffda56 50.72%, #ffd6a6);
  }

  .about-us1 {
    color: #1c1f35;
  }

  .about-us1,
  .pattern {
    position: relative;
  }
  .text {
    background-color: rgba(232, 232, 232, 0.5);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0.188rem 0.375rem 0.188rem 0.563rem;
    white-space: nowrap;
    z-index: 1;
  }
  .about-us-team-project-pricing {
    height: 1.5rem;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .our-company-overview {
    margin: 0;
    position: relative;
    font-size: inherit;
    font-weight: 600;
    font-family: inherit;
    display: inline-block;
    max-width: 100%;
  }
  .leverage-agile-frameworks {
    width: 37.75rem;
    position: relative;
    font-size: 1rem;
    line-height: 151.52%;
    font-weight: 500;
    font-family: Krub;
    color: #666c89;
    text-align: left;
    display: inline-block;
  }
  .line-frame,
  .nav-bar-frame {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    max-width: 100%;
  }
  .line-frame {
    gap: 0.75rem 0;
    text-align: center;
    font-size: 2.188rem;
  }
  .nav-bar-frame {
    gap: 0.938rem 0;
    font-size: 0.875rem;
    font-family: Rubik;
  }
  .our-approch {
    position: relative;
    font-size: 1.188rem;
    line-height: 151.52%;
    font-weight: 600;
    font-family: Krub;
    color: #fff;
    text-align: left;
  }
  .transit-flow-home-page {
    cursor: pointer;
    border: 0;
    padding: 0.938rem 2.313rem 1rem 2.25rem;
    background-color: #ffb82b;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }
  .transit-flow-home-page:hover {
    background-color: #cc8500;
  }
  .our-approch1 {
    position: relative;
    font-size: 1.188rem;
    line-height: 151.52%;
    font-weight: 600;
    font-family: Krub;
    color: #1c1f35;
    text-align: left;
  }
  .transit-flow-home-page1 {
    cursor: pointer;
    border: 0;
    padding: 0.938rem 2.313rem 1rem 2.25rem;
    background-color: #f4f4f4;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }
  .transit-flow-home-page1:hover,
  .transit-flow-home-page2:hover {
    background-color: #dbdbdb;
  }
  .our-approch2 {
    position: relative;
    font-size: 1.188rem;
    line-height: 151.52%;
    font-weight: 600;
    font-family: Krub;
    color: #1c1f35;
    text-align: left;
  }
  .content1,
  .transit-flow-home-page2 {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .transit-flow-home-page2 {
    cursor: pointer;
    border: 0;
    padding: 0.938rem 2.313rem 1rem 2.25rem;
    background-color: #f4f4f4;
    justify-content: center;
    white-space: nowrap;
  }
  .content1 {
    align-self: stretch;
    justify-content: flex-start;
    gap: 0 0.875rem;
  }
  .sed-ut-perspiciatis {
    width: 37.688rem;
    position: relative;
    line-height: 151.52%;
    font-weight: 500;
    display: inline-block;
  }
  .call-us-text-btn,
  .content {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    max-width: 100%;
  }
  .content {
    flex: 1;
    flex-direction: column;
    gap: 1.688rem 0;
  }
  .call-us-text-btn {
    align-self: stretch;
    flex-direction: row;
    padding: 0 0 1rem;
    box-sizing: border-box;
    color: #666c89;
  }
  .background-icon {
    height: 100%;
    width: calc(100% - 4px);
    position: absolute;
    margin: 0 !important;
    top: -0.031rem;
    right: 0.25rem;
    bottom: 0.031rem;
    left: 0;
    max-width: 100%;
    overflow: hidden;
    max-height: 100%;
  }
  .learn-more {
    position: relative;
    line-height: 135.02%;
    font-weight: 600;
    white-space: nowrap;
    z-index: 1;
  }
  .button {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 1.188rem 3.375rem;
    position: relative;
    text-align: center;
    color: #fff;
  }
  .header-frame,
  .main-content-frame {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    max-width: 90%;
    
  }
  .main-content-frame {
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem 0;
    gap: 1.188rem 0;
    min-width: 24.563rem;
  }
  .header-frame {
    width: 56.5rem;
    flex-direction: row;
    align-items: center;
    padding: 0 1.25rem 1.188rem;
    gap: 0 6.25rem;
    text-align: left;
    font-size: 1rem;
    color: #1c1f35;
    font-family: Krub;
  }
  .pattern1 {
    height: 1.438rem;
    width: 0.25rem;
    background: linear-gradient(94.06deg, #ffb62a, #ffda56 50.72%, #ffd6a6);
  }
  .pattern1,
  .what-we-do {
    position: relative;
  }
  .patterns-background,
  .text1 {
    display: flex;
    flex-direction: row;
  }
  .text1 {
    background-color: rgba(232, 232, 232, 0.5);
    align-items: center;
    justify-content: center;
    padding: 0.188rem 0.375rem 0.188rem 0.563rem;
    white-space: nowrap;
  }
  .patterns-background {
    align-items: flex-start;
    justify-content: flex-start;
  }
  .our-logistics-services {
    margin: 0;
    align-self: stretch;
    position: relative;
    font-size: 2.188rem;
    font-weight: 600;
    font-family: inherit;
    text-align: center;
  }
  .contact-us-frame,
  .transit-flow-footer {
    display: flex;
    justify-content: flex-start;
    max-width: 100%;
  }
  .transit-flow-footer {
    flex: 1;
    flex-direction: column;
    align-items: center;
    gap: 0.938rem 0;
  }
  .contact-us-frame {
    width: 25.313rem;
    flex-direction: row;
    align-items: flex-start;
    padding: 0 0 0 0.5rem;
    box-sizing: border-box;
  }
  .icon {
    width: 3.063rem;
    height: 3.5rem;
  }
  .icon,
  .sea-transport-services {
    position: relative;
  }
  .following-the-quality {
    width: 16.875rem;
    position: relative;
    font-size: 1rem;
    line-height: 151.52%;
    font-weight: 500;
    font-family: Krub;
    color: #666c89;
    display: inline-block;
  }
  .team-name-frame,
  .text2 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.813rem 0;
  }
  .team-name-frame {
    gap: 1.375rem 0;
  }
  .icon1 {
    width: 3.375rem;
    height: 3.5rem;
    position: relative;
  }
  .warehousing-services {
    align-self: stretch;
    position: relative;
  }
  .following-the-quality1 {
    width: 16.875rem;
    position: relative;
    font-size: 1rem;
    line-height: 151.52%;
    font-weight: 500;
    font-family: Krub;
    color: #666c89;
    display: inline-block;
  }
  .team-name-frame1,
  .text3 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .text3 {
    align-self: stretch;
    gap: 0.813rem 0;
  }
  .team-name-frame1 {
    width: 16.875rem;
    gap: 1.375rem 0;
  }
  .icon2 {
    width: 4.5rem;
    height: 3.5rem;
    position: relative;
  }
  .air-fright-services {
    align-self: stretch;
    position: relative;
  }
  .following-the-quality2 {
    width: 17.25rem;
    position: relative;
    font-size: 1rem;
    line-height: 151.52%;
    font-weight: 500;
    font-family: Krub;
    color: #666c89;
    display: inline-block;
  }
  .team-name-frame2,
  .text4 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .text4 {
    align-self: stretch;
    gap: 0.813rem 0;
  }
  .team-name-frame2 {
    width: 16.875rem;
    gap: 1.375rem 0;
  }
  .icon3 {
    width: 3.125rem;
    height: 3.519rem;
    position: relative;
  }
  .project-exhibition {
    align-self: stretch;
    position: relative;
  }
  .following-the-quality3 {
    width: 16.875rem;
    position: relative;
    font-size: 1rem;
    line-height: 151.52%;
    font-weight: 500;
    font-family: Krub;
    color: #666c89;
    display: inline-block;
  }
  .team-name-frame3,
  .text5 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .text5 {
    align-self: stretch;
    gap: 0.813rem 0;
  }
  .team-name-frame3 {
    width: 16.875rem;
    gap: 1.375rem 0;
  }
  .icon4 {
    width: 3.375rem;
    height: 3.5rem;
  }
  .icon4,
  .local-shipping-services {
    position: relative;
  }
  .following-the-quality4 {
    width: 16.875rem;
    position: relative;
    font-size: 1rem;
    line-height: 151.52%;
    font-weight: 500;
    font-family: Krub;
    color: #666c89;
    display: inline-block;
  }
  .team-name-frame4,
  .text6 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.813rem 0;
  }
  .team-name-frame4 {
    gap: 1.375rem 0;
  }
  .icon5 {
    width: 3.438rem;
    height: 3.5rem;
    position: relative;
  }
  .customer-clearance {
    align-self: stretch;
    position: relative;
  }
  .following-the-quality5 {
    width: 17.25rem;
    position: relative;
    font-size: 1rem;
    line-height: 151.52%;
    font-weight: 500;
    font-family: Krub;
    color: #666c89;
    display: inline-block;
  }
  .content2,
  .team-name-frame5,
  .text7 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .text7 {
    align-self: stretch;
    gap: 0.813rem 0;
  }
  .content2,
  .team-name-frame5 {
    width: 16.875rem;
    gap: 1.375rem 0;
  }
  .content2 {
    width: 75.063rem;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 3.313rem 11.75rem;
    min-height: 27.438rem;
    max-width: 100%;
    font-size: 1.563rem;
  }
  .background-icon1 {
    height: 100%;
    width: 100%;
    position: absolute;
    margin: 0 !important;
    top: 0.019rem;
    right: 0.025rem;
    bottom: -0.019rem;
    left: -0.025rem;
    max-width: 100%;
    overflow: hidden;
    max-height: 100%;
  }
  .more-works {
    position: relative;
    line-height: 135.02%;
    font-weight: 600;
    z-index: 1;
  }
  .button1 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 1.188rem 3rem 1.188rem 3.25rem;
    position: relative;
  }
  .our-project-changelicenses {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 0 0 0.5rem;
    text-align: center;
    font-size: 1rem;
    color: #fff;
    font-family: Krub;
  }
  .parentframelogo,
  .services {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    max-width: 100%;
  }
  .services {
    flex: 1;
    background-color: #f4f4f4;
    flex-direction: column;
    align-items: center;
    padding: 6.75rem 1.688rem 6.688rem 1.25rem;
    gap: 3.438rem 0;
    flex-shrink: 0;
  }
  .parentframelogo {
    align-self: stretch;
    flex-direction: row;
    align-items: flex-start;
    padding: 0 0.438rem 1.25rem 0;
    text-align: left;
    font-size: 0.875rem;
    color: #1c1f35;
    font-family: Rubik;
  }
  .pattern2 {
    height: 1.438rem;
    width: 0.25rem;
    background: linear-gradient(94.06deg, #ffb62a, #ffda56 50.72%, #ffd6a6);
  }
  .pattern2,
  .the-transporters {
    position: relative;
  }
  .logo-image,
  .text8 {
    display: flex;
    flex-direction: row;
  }
  .text8 {
    background-color: rgba(232, 232, 232, 0.5);
    align-items: center;
    justify-content: center;
    padding: 0.188rem 0.25rem 0.188rem 0.5rem;
    white-space: nowrap;
    z-index: 1;
  }
  .logo-image {
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 0.063rem 0 0;
  }
  .meet-expert-team {
    margin: 0;
    position: relative;
    font-size: 2.188rem;
    font-weight: 600;
    font-family: inherit;
  }
  .icon-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem 0;
  }
  .image-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 22.75rem;
    height: 26.625rem;
    object-fit: cover;
  }
  .social-media-icon {
    position: absolute;
    top: 24.719rem;
    left: 13.294rem;
    max-height: 100%;
    width: 9.456rem;
    object-fit: contain;
    z-index: 2;
  }
  .team-members-page {
    align-self: stretch;
    height: 28.563rem;
    position: relative;
  }
  .background-icon2 {
    width: 22.75rem;
    height: 7rem;
    position: relative;
    display: none;
    max-width: 100%;
  }
  .designer,
  .jessca-arow {
    position: relative;
    font-weight: 500;
    z-index: 1;
  }
  .designer {
    font-size: 1rem;
    line-height: 151.52%;
    font-family: Krub;
  }
  .about-us-page,
  .name {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .name {
    align-self: stretch;
    height: 7rem;
    background-color: #1c1f35;
    justify-content: flex-end;
    padding: 1.25rem 2.125rem;
    box-sizing: border-box;
    gap: 0.125rem;
    max-width: 100%;
    margin-top: -1.937rem;
  }
  .about-us-page {
    width: 22.75rem;
    flex-shrink: 0;
    justify-content: flex-start;
  }
  .image-icon1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 22.75rem;
    height: 26.625rem;
    object-fit: cover;
  }
  .social-media-icon1 {
    position: absolute;
    top: 24.719rem;
    left: 10.369rem;
    max-height: 100%;
    width: 12.381rem;
    object-fit: contain;
    z-index: 2;
  }
  .image-parent {
    align-self: stretch;
    height: 28.563rem;
    position: relative;
  }
  .background-icon3 {
    width: 22.75rem;
    height: 7rem;
    position: relative;
    display: none;
    max-width: 100%;
  }
  .designer1,
  .kathleen-smith {
    position: relative;
    font-weight: 500;
    z-index: 1;
  }
  .designer1 {
    font-size: 1rem;
    line-height: 151.52%;
    font-family: Krub;
  }
  .about-us-page1,
  .name1 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .name1 {
    align-self: stretch;
    height: 7rem;
    background-color: #1c1f35;
    justify-content: flex-end;
    padding: 1.25rem 2.125rem;
    box-sizing: border-box;
    gap: 0.125rem;
    max-width: 100%;
    margin-top: -1.937rem;
  }
  .about-us-page1 {
    width: 22.75rem;
    flex-shrink: 0;
    justify-content: flex-start;
  }
  .image-icon2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 22.75rem;
    height: 26.625rem;
    object-fit: cover;
  }
  .social-media-icon2 {
    position: absolute;
    top: 24.719rem;
    left: 16.212rem;
    max-height: 100%;
    width: 6.538rem;
    object-fit: contain;
    z-index: 2;
  }
  .image-group {
    align-self: stretch;
    height: 28.563rem;
    position: relative;
  }
  .background-icon4 {
    width: 22.75rem;
    height: 7rem;
    position: relative;
    display: none;
    max-width: 100%;
  }
  .designer2,
  .rebecca-tylor {
    position: relative;
    font-weight: 500;
    z-index: 1;
  }
  .rebecca-tylor {
    width: 9.938rem;
    color: inherit;
    display: inline-block;
    text-decoration: none;
  }
  .designer2 {
    font-size: 1rem;
    line-height: 151.52%;
    font-family: Krub;
  }
  .name2 {
    align-self: stretch;
    height: 7rem;
    background-color: #1c1f35;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 1.25rem 2.125rem;
    box-sizing: border-box;
    gap: 0.125rem;
    max-width: 100%;
    margin-top: -1.937rem;
  }
  .about-us-page2,
  .studiogreen,
  .team {
    display: flex;
    justify-content: flex-start;
  }
  .about-us-page2 {
    width: 22.75rem;
    flex-shrink: 0;
    flex-direction: column;
    align-items: flex-start;
  }
  .studiogreen,
  .team {
    max-width: 100%;
  }
  .team {
    width: 75rem;
    overflow-x: auto;
    flex-direction: row;
    align-items: flex-start;
    gap: 0 3.375rem;
    text-align: left;
    font-size: 1.25rem;
    color: #fff;
  }
  .studiogreen {
    flex-direction: column;
    align-items: center;
    padding: 0 1.25rem 1.25rem;
    box-sizing: border-box;
    gap: 2.5rem 0;
    text-align: center;
    font-size: 0.875rem;
    color: #1c1f35;
    font-family: Rubik;
  }
  .pattern3 {
    height: 1.438rem;
    width: 0.25rem;
    background: linear-gradient(94.06deg, #ffb62a, #ffda56 50.72%, #ffd6a6);
  }
  .pattern3,
  .testimonial1 {
    position: relative;
  }
  .payment-methods,
  .text9 {
    display: flex;
    flex-direction: row;
  }
  .text9 {
    flex: 1;
    background-color: rgba(232, 232, 232, 0.5);
    align-items: center;
    justify-content: center;
    padding: 0.188rem;
  }
  .payment-methods {
    width: 6.063rem;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .what-our-customer {
    margin: 0;
    position: relative;
    font-size: 2.188rem;
    font-weight: 600;
    font-family: inherit;
  }
  .logistics-options {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.813rem 0;
    max-width: 100%;
  }
  .logistic-details-icon,
  .logistic-details-icon1 {
    height: 2.719rem;
    width: 2.719rem;
    position: relative;
    min-height: 2.75rem;
  }
  .what-payment-methods {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 0.063rem 0 0;
    gap: 0 0.563rem;
  }
  .call-button-field {
    width: 75rem;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    max-width: 100%;
    gap: 1.25rem;
  }
  .user-icon {
    height: 5.688rem;
    width: 5.688rem;
    position: relative;
    object-fit: cover;
    min-height: 5.688rem;
  }
  .fuel-company,
  .kathleen-smith1 {
    position: relative;
    font-weight: 500;
  }
  .fuel-company {
    font-size: 1rem;
    line-height: 151.52%;
    font-family: Krub;
  }
  .name3,
  .user2 {
    display: flex;
    justify-content: flex-start;
  }
  .name3 {
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem 0;
    gap: 0.125rem 0;
  }
  .user2 {
    width: 15.875rem;
    flex-direction: row;
    align-items: center;
    gap: 0 0.625rem;
  }
  .footer-icon {
    height: 4.556rem;
    width: 4.556rem;
    position: relative;
  }
  .user1 {
    align-self: stretch;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
  }
  .leverage-agile-frameworks1 {
    width: 28.5rem;
    position: relative;
    line-height: 151.52%;
    display: inline-block;
    font-weight: 500;
  }
  .star-icon {
    width: 11.25rem;
    height: 2.125rem;
    position: relative;
  }
  .text10 {
    align-self: stretch;
    gap: 2rem 0;
    font-size: 1rem;
    color: #666c89;
    font-family: Krub;
  }
  .frame-pages-utility-subscribe,
  .review,
  .text10 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .review {
    align-self: stretch;
    gap: 1.5rem 0;
  }
  .frame-pages-utility-subscribe {
    flex: 1;
    background-color: #f4f4f4;
    padding: 3.875rem 4.5rem;
    box-sizing: border-box;
    min-width: 24.375rem;
    max-width: 100%;
  }
  .user-icon1 {
    height: 5.688rem;
    width: 5.688rem;
    position: relative;
    object-fit: cover;
    min-height: 5.688rem;
  }
  .john-martin,
  .restoration-company {
    position: relative;
    font-weight: 500;
  }
  .restoration-company {
    font-size: 1rem;
    line-height: 151.52%;
    font-family: Krub;
    white-space: nowrap;
  }
  .name4,
  .user4 {
    display: flex;
    justify-content: flex-start;
  }
  .name4 {
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem 0;
    gap: 0.125rem 0;
  }
  .user4 {
    width: 15.563rem;
    flex-direction: row;
    align-items: center;
    gap: 0 0.625rem;
  }
  .icon6 {
    height: 4.556rem;
    width: 4.556rem;
    position: relative;
  }
  .user3 {
    align-self: stretch;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
  }
  .leverage-agile-frameworks2 {
    width: 28.5rem;
    position: relative;
    line-height: 151.52%;
    display: inline-block;
    font-weight: 500;
  }
  .star-icon1 {
    width: 11.25rem;
    height: 2.125rem;
    position: relative;
  }
  .text11 {
    align-self: stretch;
    display: flex;
    justify-content: flex-start;
    gap: 2rem 0;
    font-size: 1rem;
    font-family: Krub;
  }
  .frame-pages-utility-subscribe1,
  .review1,
  .text11 {
    flex-direction: column;
    align-items: flex-start;
  }
  .review1 {
    align-self: stretch;
    display: flex;
    justify-content: flex-start;
    gap: 1.5rem 0;
  }
  .frame-pages-utility-subscribe1 {
    flex: 1;
    background-color: #091242;
    padding: 3.875rem 4.5rem;
    box-sizing: border-box;
    min-width: 24.375rem;
    color: #fff;
  }
  .frame-lets-talk,
  .frame-pages-utility-subscribe1,
  .testimonial,
  .user {
    display: flex;
    justify-content: flex-start;
    max-width: 100%;
  }
  .user {
    width: 75rem;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    row-gap: 20px;
    font-size: 1.25rem;
    color: #091242;
  }
  .frame-lets-talk,
  .testimonial {
    box-sizing: border-box;
  }
  .testimonial {
    flex: 1;
    background-color: #f4f4f4;
    flex-direction: column;
    align-items: center;
    padding: 6.125rem 1.25rem;
    gap: 2.5rem 0;
  }
  .frame-lets-talk {
    align-self: stretch;
    flex-direction: row;
    align-items: flex-start;
    padding: 0 0 1.25rem 0.125rem;
    text-align: left;
    font-size: 0.875rem;
    color: #1c1f35;
    font-family: Rubik;
  }
  .pattern4 {
    height: 1.438rem;
    width: 0.25rem;
    background: linear-gradient(94.06deg, #ffb62a, #ffda56 50.72%, #ffd6a6);
  }
  .pattern4,
  .pricing {
    position: relative;
  }
  .double-truck-frame,
  .text12 {
    display: flex;
    flex-direction: row;
  }
  .text12 {
    flex: 1;
    background-color: rgba(232, 232, 232, 0.5);
    align-items: center;
    justify-content: center;
    padding: 0.188rem;
    z-index: 1;
  }
  .double-truck-frame {
    width: 4.25rem;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .our-best-pricing {
    margin: 0;
    position: relative;
    font-size: 2.188rem;
    font-weight: 600;
    font-family: inherit;
    text-align: center;
  }
  .line-frame-single-truck {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0.938rem 0;
  }
  .basic,
  .follow-frame {
    position: relative;
    font-weight: 500;
  }
  .basic {
    margin: 0;
    width: 13.063rem;
    font-size: inherit;
    font-family: inherit;
    display: inline-block;
  }
  .follow-frame {
    white-space: nowrap;
  }
  .month {
    position: absolute;
    margin: 0 !important;
    right: -4.837rem;
    bottom: 0.944rem;
    font-size: 1.375rem;
    text-align: left;
    z-index: 1;
  }
  .name-email-input-frame,
  .send-now-button {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .send-now-button {
    position: relative;
  }
  .name-email-input-frame {
    width: 14.875rem;
    padding: 0 0 0.75rem;
    box-sizing: border-box;
    font-size: 5.313rem;
  }
  .frame-pages-utility-about-us-o {
    align-self: stretch;
    height: 0.063rem;
    position: relative;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .line-frame-line,
  .single-truck {
    position: relative;
  }
  .line-frame-line {
    align-self: stretch;
    height: 0.063rem;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .choose-plan-frame {
    align-self: stretch;
    height: 2.438rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0.938rem 0;
  }
  .full-insurance {
    position: relative;
  }
  .line-line {
    align-self: stretch;
    height: 0.063rem;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .km,
  .line-line {
    position: relative;
  }
  .choose-plan {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 0.125rem 0.25rem 0;
  }
  .line {
    align-self: stretch;
    height: 0.063rem;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .line,
  .real-time-rate-shopping {
    position: relative;
  }
  .icon-frame-one {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 1.375rem 0.25rem 1.25rem;
  }
  .footer-frame {
    align-self: stretch;
    height: 0.063rem;
    position: relative;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .full-insurance-frame {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0 0.75rem;
    gap: 1.063rem 0;
    font-size: 1.25rem;
  }
  .background-icon5 {
    height: 100%;
    width: 100%;
    position: absolute;
    margin: 0 !important;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100%;
    overflow: hidden;
    max-height: 100%;
  }
  .choose-plan1 {
    position: relative;
    line-height: 135.02%;
    font-weight: 600;
    z-index: 1;
  }
  .button2,
  .content4 {
    display: flex;
    align-items: center;
  }
  .button2 {
    flex-direction: row;
    justify-content: center;
    padding: 1.188rem 2.875rem 1.188rem 3.188rem;
    position: relative;
    text-align: left;
    font-size: 1rem;
    color: #fff;
    font-family: Krub;
  }
  .content4 {
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    gap: 2.375rem 0;
  }
  .pattern-rectangle-frame {
    width: 23.75rem;
    background-color: #f4f4f4;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 3.813rem 3.125rem;
    box-sizing: border-box;
  }
  .div,
  .standard {
    position: relative;
    font-weight: 500;
  }
  .standard {
    margin: 0;
    width: 13.063rem;
    font-size: inherit;
    font-family: inherit;
    display: inline-block;
  }
  .div {
    white-space: nowrap;
  }
  .month1 {
    position: absolute;
    margin: 0 !important;
    right: -4.9rem;
    bottom: 0.944rem;
    font-size: 1.375rem;
    text-align: left;
    z-index: 1;
  }
  .content-inner,
  .parent {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .parent {
    position: relative;
  }
  .content-inner {
    width: 14.875rem;
    padding: 0 0 0.75rem;
    box-sizing: border-box;
    font-size: 5.313rem;
  }
  .line1 {
    align-self: stretch;
    height: 0.063rem;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .line1,
  .single-truck1 {
    position: relative;
  }
  .realtime-rate-shopping-frame {
    align-self: stretch;
    height: 0.063rem;
    position: relative;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .single-truck-parent {
    align-self: stretch;
    height: 2.438rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0.938rem 0;
  }
  .full-insurance1 {
    position: relative;
  }
  .footer-background-vector-frame {
    align-self: stretch;
    height: 0.063rem;
    position: relative;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .km1 {
    position: relative;
  }
  .km-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 0.125rem 0.25rem 0;
  }
  .line2 {
    align-self: stretch;
    height: 0.063rem;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .line2,
  .real-time-rate-shopping1 {
    position: relative;
  }
  .real-time-rate-shopping-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 1.375rem 0.25rem 1.25rem;
  }
  .line3 {
    align-self: stretch;
    height: 0.063rem;
    position: relative;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .line-parent {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0 0.75rem;
    gap: 1.063rem 0;
    font-size: 1.25rem;
  }
  .background-icon6 {
    height: 100%;
    width: 100%;
    position: absolute;
    margin: 0 !important;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100%;
    overflow: hidden;
    max-height: 100%;
  }
  .choose-plan2 {
    position: relative;
    line-height: 135.02%;
    font-weight: 600;
    z-index: 1;
  }
  .button3,
  .content5 {
    display: flex;
    align-items: center;
  }
  .button3 {
    flex-direction: row;
    justify-content: center;
    padding: 1.188rem 2.875rem 1.188rem 3.188rem;
    position: relative;
    text-align: left;
    font-size: 1rem;
    color: white;
    font-family: Krub;
  }
  .content5 {
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    gap: 2.375rem 0;
  }
  .pattern-rectangle-frame1 {
    width: 23.75rem;
    background-color: #f2f2f2;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 3.813rem 3.125rem;
    box-sizing: border-box;
    color: black;
  }
  .premium,
  .style-guide-changelog {
    position: relative;
    font-weight: 500;
  }
  .premium {
    margin: 0;
    width: 13.063rem;
    font-size: inherit;
    font-family: inherit;
    display: inline-block;
  }
  .style-guide-changelog {
    white-space: nowrap;
  }
  
  
  .pattern-rectangle-frame:hover{
    background-color: #091242;
    color: white;
  }
  .pattern-rectangle-frame1:hover{
    background-color: #091242;
    color: white;
  }
  .pattern-rectangle-frame2:hover{
    background-color: #091242;
    color: white;
  }
  
  
  
  
  .pattern-rectangle-frame:hover .choose-plan1{
    color: black;
  }
  .pattern-rectangle-frame1:hover .choose-plan2{
    color: black;
  }
  
  
  .pattern-rectangle-frame2:hover .choose-plan3{
    color: black;
  }
  .month2 {
    position: absolute;
    margin: 0 !important;
    right: -4.744rem;
    bottom: 0.944rem;
    font-size: 1.375rem;
    text-align: left;
    z-index: 1;
  }
  .frame-wrapper,
  .style-guide-changelog-licenses-parent {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .style-guide-changelog-licenses-parent {
    position: relative;
  }
  .frame-wrapper {
    padding: 0 1.313rem;
  }
  .line4 {
    align-self: stretch;
    height: 0.063rem;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .double-truck,
  .line4 {
    position: relative;
  }
  .line5 {
    align-self: stretch;
    height: 0.063rem;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .full-insurance2,
  .line5 {
    position: relative;
  }
  .double-truck-parent {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem 0;
  }
  .line6 {
    align-self: stretch;
    height: 0.063rem;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .line6,
  .unlimitted {
    position: relative;
  }
  .unlimitted-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 0.125rem 0.25rem 0;
  }
  .line7 {
    align-self: stretch;
    height: 0.063rem;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .line7,
  .real-time-rate-shopping2 {
    position: relative;
  }
  .km-line {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 1.375rem 0 1.25rem;
  }
  .line8 {
    align-self: stretch;
    height: 0.063rem;
    position: relative;
    border-top: 1px solid #d5d5d5;
    box-sizing: border-box;
  }
  .choose-plan-btn,
  .frame-parent,
  .line-group {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  .choose-plan-btn {
    height: 2.813rem;
    gap: 1.313rem 0;
  }
  .frame-parent,
  .line-group {
    gap: 1.063rem 0;
    font-size: 1.25rem;
  }
  .frame-parent {
    align-items: flex-start;
    padding: 0 0 0.75rem;
    gap: 3.125rem 0;
    font-size: 5.313rem;
  }
  .background-icon7 {
    height: 100%;
    width: 100%;
    position: absolute;
    margin: 0 !important;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100%;
    overflow: hidden;
    max-height: 100%;
  }
  .choose-plan3 {
    position: relative;
    line-height: 135.02%;
    font-weight: 600;
    z-index: 1;
  }
  .button4,
  .content6 {
    display: flex;
    align-items: center;
  }
  .button4 {
    flex-direction: row;
    justify-content: center;
    padding: 1.188rem 2.875rem 1.188rem 3.188rem;
    position: relative;
    text-align: left;
    font-size: 1rem;
    color: #fff;
    font-family: Krub;
  }
  .content6 {
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    gap: 2.375rem 0;
  }
  .pattern-rectangle-frame2 {
    width: 23.75rem;
    background-color: #f4f4f4;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 3.813rem 3.125rem;
    box-sizing: border-box;
  }
  .content3,
  .pricing-text {
    display: flex;
    justify-content: flex-start;
    max-width: 100%;
  }
  .content3 {
    width: 74.875rem;
    overflow-x: auto;
    flex-direction: row;
    align-items: flex-start;
    gap: 0 1.813rem;
    text-align: center;
    font-size: 1.875rem;
  }
  .pricing-text {
    flex-direction: column;
    align-items: center;
    padding: 0 1.25rem 1.188rem;
    box-sizing: border-box;
    gap: 4rem 0;
    text-align: left;
    font-size: 0.875rem;
    color: #1c1f35;
    font-family: Rubik;
  }
  .background {
    height: 46.188rem;
    width: 119.875rem;
    position: relative;
    background-color: #f4f4f4;
    display: none;
    max-width: 100%;
  }
  .pattern5 {
    height: 1.438rem;
    width: 0.25rem;
    background: linear-gradient(94.06deg, #ffb62a, #ffda56 50.72%, #ffd6a6);
    z-index: 1;
  }
  .faq1,
  .pattern5 {
    position: relative;
  }
  .text13 {
    flex: 1;
    background-color: rgba(232, 232, 232, 0.5);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0.188rem;
    z-index: 1;
  }
  .about-us-team-pricing-contact {
    width: 3.063rem;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .frequently-asked-questions {
    margin: 0;
    width: 19.25rem;
    position: relative;
    font-size: 2.188rem;
    font-weight: 600;
    font-family: inherit;
    display: inline-block;
    z-index: 1;
  }
  .frame-utility-subscribing {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 0 0.375rem;
    gap: 0.938rem 0;
    font-size: 0.875rem;
  }
  
  .leverage-agile-frameworks3 {
    position: relative;
    display: inline-block;
    display: none;
  
  }
  
  .how-can-i {
    width: 27.125rem;
    max-width: 100%;
  }
  
  
  .leverage-agile-frameworks3 {
    width: 35.563rem;
    font-size: 1rem;
    line-height: 151.52%;
    font-weight: 500;
    font-family: Krub;
    color: #666c89;
  }
  .footer-frame-contact {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 1.125rem 0;
    max-width: 100%;
  }
  .what-payment-methods1 {
    width: 26.188rem;
  }
  .can-i-specify,
  .what-options-for,
  .what-payment-methods1 {
    position: relative;
    display: inline-block;
    max-width: 100%;
    z-index: 1;
  }
  .options-pattern-pattern-patter {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 1.563rem 0 0;
    box-sizing: border-box;
    gap: 2.75rem 0;
    max-width: 100%;
  }
  .icon10,
  .icon7,
  .icon8,
  .icon9 {
    width: 1rem;
    height: 0.5rem;
    position: relative;
    z-index: 1;
  }
  .icon10,
  .icon8,
  .icon9 {
    width: 0.5rem;
    height: 1rem;
    object-fit: contain;
  }
  .icon-parent,
  .image-logo-and-address-frame-inner {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .icon-parent {
    flex-direction: column;
    gap: 3.25rem 0;
  }
  .image-logo-and-address-frame-inner {
    flex-direction: row;
    padding: 0 0.313rem 0 0.188rem;
  }
  .image-logo-and-address-frame {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 9.313rem 0;
  }
  .image-logo-and-address-frame-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 11.125rem 0 0;
  }
  .image-icon3 {
    height: 33.688rem;
    width: 42.625rem;
    position: absolute;
    margin: 0 !important;
    top: -5.375rem;
    right: -21.437rem;
    object-fit: cover;
    z-index: 1;
  }
  .pattern7 {
    height: 1.438rem;
    width: 0.25rem;
    background: linear-gradient(94.06deg, #ffb62a, #ffda56 50.72%, #ffd6a6);
  }
  .lets-talk,
  .pattern7 {
    position: relative;
  }
  .address1,
  .pattern6,
  .text14 {
    display: flex;
    flex-direction: row;
  }
  .text14 {
    background-color: #111c55;
    align-items: center;
    justify-content: center;
    padding: 0.188rem 0.313rem 0.188rem 0.5rem;
    white-space: nowrap;
  }
  .address1,
  .pattern6 {
    align-items: flex-start;
    justify-content: flex-start;
  }
  .address1 {
    align-self: stretch;
    padding: 0 0.625rem;
  }
  .you-need-any {
    width: 20.25rem;
    position: relative;
    font-size: 1.25rem;
    text-transform: capitalize;
    font-weight: 500;
    display: inline-block;
    max-width: 100%;
  }
  .icon11 {
    height: 3.938rem;
    width: 3.938rem;
    position: relative;
  }
  .have-any-questions,
  .p {
    margin: 0;
  }
  .have-any-questions-container {
    position: relative;
    line-height: 135.02%;
    font-weight: 500;
  }
  .background1 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 0 0.875rem;
  }
  .background-icon8 {
    height: 3.75rem;
    width: 8.875rem;
    position: relative;
    display: none;
    z-index: 0;
  }
  .background-icon9 {
    height: 100%;
    width: 100%;
    position: absolute;
    margin: 0 !important;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100%;
    overflow: hidden;
    max-height: 100%;
    z-index: 1;
  }
  .contact-us1 {
    position: relative;
    line-height: 135.02%;
    font-weight: 600;
    z-index: 2;
  }
  .button5 {
    background: linear-gradient(94.06deg, #ffb62a, #ffda56 50.72%, #ffd6a6);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 1.188rem 1.563rem 1.188rem 1.875rem;
    position: relative;
    color: #23212b;
  }
  .f-a-q-frame {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.625rem 0;
  }
  .address,
  .contact-us,
  .f-a-q-frame {
    display: flex;
    justify-content: flex-start;
  }
  .contact-us {
    align-self: stretch;
    flex-direction: row;
    align-items: flex-start;
    padding: 0 0.625rem;
    font-size: 1rem;
    font-family: Krub;
  }
  .address {
    flex: 1;
    background-color: #091242;
    flex-direction: column;
    align-items: center;
    padding: 3.25rem;
    box-sizing: border-box;
    gap: 1.375rem 0;
    max-width: 100%;
    z-index: 2;
  }
  .faq,
  .frame-parent1,
  .free-consultation-button-frame,
  .support-f-a-q-frame {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    max-width: 100%;
  }
  .support-f-a-q-frame {
    align-self: stretch;
    flex-direction: row;
    position: relative;
  }
  .faq,
  .frame-parent1,
  .free-consultation-button-frame {
    box-sizing: border-box;
  }
  .free-consultation-button-frame {
    width: 28rem;
    flex-direction: column;
    padding: 3.75rem 0 0;
    font-size: 0.875rem;
    color: #fff;
  }
  .faq,
  .frame-parent1 {
    flex-direction: row;
  }
  .faq {
    background-color: #f4f4f4;
    padding: 7.875rem 22.5rem 7.813rem 22.375rem;
    gap: 4.438rem;
  }
  .frame-parent1 {
    padding: 0 0 0 0.125rem;
    text-align: left;
    font-size: 1.25rem;
    color: #1c1f35;
    font-family: Rubik;
  }
  .image-icon4 {
    height: 100%;
    width: 100%;
    position: absolute;
    margin: 0 !important;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100%;
    overflow: hidden;
    max-height: 100%;
    object-fit: cover;
  }
  .footer-background-icon {
    height: 3.225rem;
    width: 3.225rem;
    position: relative;
    z-index: 1;
  }
  .green,
  .studio {
    margin: 0;
    letter-spacing: 0.56em;
  }
  .green {
    letter-spacing: 0.76em;
  }
  .studio-green {
    width: 9.063rem;
    position: relative;
    text-transform: uppercase;
    display: inline-block;
    z-index: 1;
  }
  .contact-info {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 5.688rem 2.938rem 5.75rem 3rem;
    gap: 0.563rem;
    color: #fff;
  }
  .background2,
  .follow-icon {
    position: absolute;
    top: 0;
    height: 100%;
  }
  .follow-icon {
    bottom: 0;
    left: 18.813rem;
    max-height: 100%;
    width: 18.75rem;
    object-fit: cover;
  }
  .background2 {
    left: 0;
    background-color: #fff;
    width: 100%;
    display: none;
  }
  .one,
  .points {
    margin: 0;
  }
  .points-one {
    position: absolute;
    top: 0.031rem;
    left: 3.644rem;
    letter-spacing: 0.56em;
    text-transform: uppercase;
  }
  .icon12 {
    top: 0;
    left: 0;
    width: 11.525rem;
    height: 2.963rem;
  }
  .icon12,
  .image,
  .logo2 {
    position: absolute;
  }
  .logo2 {
    top: 5.813rem;
    left: 3.563rem;
    width: 11.581rem;
    height: 2.963rem;
    z-index: 1;
  }
  .image {
    height: 100%;
    top: 0;
    bottom: 0;
    left: 37.563rem;
    background-color: #fff;
    width: 18.75rem;
    font-family: "Times New Roman";
  }
  .transit-flow-text {
    width: 0.063rem;
    flex: 1;
    position: relative;
    border-right: 1px solid #4e5683;
    box-sizing: border-box;
  }
  .image-frame {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 0.375rem 0 0;
  }
  .image-icon5 {
    height: 100%;
    width: 100%;
    position: absolute;
    margin: 0 !important;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100%;
    overflow: hidden;
    max-height: 100%;
    object-fit: cover;
  }
  .outofthe,
  .sand-box {
    margin: 0;
  }
  .out-of-the-container {
    height: 3.25rem;
    width: 11.563rem;
    position: relative;
    letter-spacing: 0.56em;
    text-transform: uppercase;
    display: inline-block;
    z-index: 1;
  }
  .pattern8 {
    position: absolute;
    top: -0.019rem;
    left: -0.019rem;
    border: 1px solid #091242;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: none;
    z-index: 2;
  }
  .pattern9 {
    position: absolute;
    top: 0.113rem;
    left: 0.106rem;
    background-color: #091242;
    width: 0.5rem;
    height: 0.375rem;
    z-index: 3;
  }
  .studio-green-address-frame {
    height: 0.625rem;
    width: 0.75rem;
    position: absolute;
    margin: 0 !important;
    right: 5rem;
    bottom: 1.688rem;
    border: 1px solid #091242;
    box-sizing: border-box;
    z-index: 2;
  }
  .logo-image-frame {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 1.25rem 0;
    position: relative;
  }
  .realtime-rate-shopping-line {
    align-self: stretch;
    width: 0.063rem;
    position: relative;
    border-right: 1px solid #4e5683;
    box-sizing: border-box;
  }
  .footer-line {
    position: absolute;
    top: 0;
    left: 56.313rem;
    width: 18.688rem;
    height: 14.625rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
    font-family: Thabit;
  }
  .follow,
  .follow1 {
    position: absolute;
    left: 0;
    border-top: 1px solid #4e5683;
    box-sizing: border-box;
    width: 75.063rem;
    height: 0.063rem;
  }
  .follow {
    top: 14.625rem;
  }
  .follow1 {
    top: 0;
  }
  .image-logo-parent {
    height: 14.625rem;
    flex: 1;
    position: relative;
    max-width: 100%;
  }
  .about-us,
  .points-one-icon-line-frame {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
  }
  .points-one-icon-line-frame {
    width: 75.125rem;
    flex-direction: row;
    align-items: flex-start;
    padding: 0 0.125rem 0 0;
    max-width: 100%;
    text-align: left;
    font-size: 1.25rem;
    color: #091242;
    font-family: Syne;
  }
  .about-us {
    width: 100%;
    position: relative;
    background-color: #fff;
    overflow: hidden;
    flex-direction: column;
    align-items: center;
    padding: 4.063rem 0 4.875rem;
    gap: 5.063rem 0;
    letter-spacing: normal;
  }
  @media screen and (max-width: 1825px) {
    .faq {
      flex-wrap: wrap;
    }
  }
  @media screen and (max-width: 1350px) {
    .images-icon {
      flex: 1;
    }
    .header-frame {
      flex-wrap: wrap;
      margin-left: 20rem;
    }

    .wrapper-images{
      margin-left: 14rem;
    }

    .content2 {
      gap: 3.313rem 11.75rem;
      margin-left: 20rem;
    }

    .team{
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .faq {
      gap: 4.438rem;
      padding-left: 11.188rem;
      padding-right: 11.25rem;
      box-sizing: border-box;
      margin-left: -6rem;
    }
    .points-one-icon-line-frame {
      max-width: calc(100% - 2px);
    }
    .about-us {
      gap: 5.063rem 0;
    }
  }
  @media screen and (max-width: 925px) {
    .our-company-overview {
      font-size: 1.75rem;
    }
    .content1 {
      flex-wrap: wrap;
    }
    .main-content-frame {
      min-width: 100%;
    }
    .header-frame {
      gap: 0 6.25rem;
      margin-right: 20rem;
    }
    .our-logistics-services {
      font-size: 1.75rem;
    }
    .content2 {
      gap: 3.313rem 11.75rem;
      margin-left: 30rem;
    }
    .services {
      gap: 3.438rem 0;
      padding-top: 4.375rem;
      padding-bottom: 4.375rem;
      box-sizing: border-box;
    }
    .meet-expert-team {
      font-size: 1.75rem;
    }
    .team {
      gap: 1rem;
    }
    .studiogreen {
      gap: 2.5rem 0;
    }
    .what-our-customer {
      font-size: 1.75rem;
    }
    .call-button-field {
      flex-wrap: wrap;
    }
    .frame-pages-utility-subscribe,
    .frame-pages-utility-subscribe1 {
      padding-left: 2.25rem;
      padding-right: 2.25rem;
      box-sizing: border-box;
      min-width: 100%;
    }
    .testimonial {
      gap: 2.5rem 0;
      padding-top: 4rem;
      padding-bottom: 4rem;
      box-sizing: border-box;
    }
    .our-best-pricing {
      font-size: 1.75rem;
    }
    .basic {
      font-size: 1.5rem;
    }
    .follow-frame {
      font-size: 2.625rem;
    }
    .pattern-rectangle-frame {
      padding-top: 2.5rem;
      padding-bottom: 2.5rem;
      box-sizing: border-box;
    }
    .standard {
      font-size: 1.5rem;
    }
    .div {
      font-size: 2.625rem;
    }
    .pattern-rectangle-frame1 {
      padding-top: 2.5rem;
      padding-bottom: 2.5rem;
      box-sizing: border-box;
    }
    .premium {
      font-size: 1.5rem;
    }
    .style-guide-changelog {
      font-size: 2.625rem;
    }
    .pattern-rectangle-frame2 {
      padding-top: 2.5rem;
      padding-bottom: 2.5rem;
      box-sizing: border-box;
    }
    .pricing-text {
      gap: 4rem 0;
    }
    .frequently-asked-questions {
      font-size: 1.75rem;
    }
    .options-pattern-pattern-patter {
      gap: 2.75rem 0;
    }
    .image-logo-and-address-frame-wrapper {
      padding-top: 7.25rem;
      box-sizing: border-box;
    }
    .faq {
      gap: 4.438rem;
      padding: 5.125rem 5.625rem 5.063rem 5.563rem;
      box-sizing: border-box;
    }
    .about-us {
      gap: 5.063rem 0;
    }
  }
  @media screen and (max-width: 450px) {
    .our-company-overview {
      font-size: 1.313rem;
    }
    .header-frame {
      gap: 0 6.25rem;
    }
    .our-logistics-services {
      font-size: 1.313rem;
    }
    .air-fright-services,
    .customer-clearance,
    .local-shipping-services,
    .project-exhibition,
    .sea-transport-services,
    .warehousing-services {
      font-size: 1.25rem;
    }
    .content2 {
      gap: 3.313rem 11.75rem;
    }
    .services {
      padding-top: 2.813rem;
      padding-bottom: 2.813rem;
      box-sizing: border-box;
    }
    .meet-expert-team {
      font-size: 1.313rem;
    }
    .jessca-arow,
    .kathleen-smith,
    .rebecca-tylor {
      font-size: 1rem;
    }
    .what-our-customer {
      font-size: 1.313rem;
    }
    .kathleen-smith1 {
      font-size: 1rem;
    }
    .user1 {
      flex-wrap: wrap;
    }
    .text10 {
      gap: 2rem 0;
    }
    .frame-pages-utility-subscribe {
      padding-top: 2.5rem;
      padding-bottom: 2.5rem;
      box-sizing: border-box;
    }
    .john-martin {
      font-size: 1rem;
    }
    .user3 {
      flex-wrap: wrap;
    }
    .text11 {
      gap: 2rem 0;
    }
    .frame-pages-utility-subscribe1 {
      padding-top: 2.5rem;
      padding-bottom: 2.5rem;
      box-sizing: border-box;
    }
    .our-best-pricing {
      font-size: 1.313rem;
    }
    .basic {
      font-size: 1.125rem;
    }
    .follow-frame {
      font-size: 1.563rem;
    }
    .month {
      font-size: 1.125rem;
    }
    .full-insurance,
    .km,
    .real-time-rate-shopping,
    .single-truck {
      font-size: 1rem;
    }
    .standard {
      font-size: 1.125rem;
    }
    .div {
      font-size: 1.563rem;
    }
    .month1 {
      font-size: 1.125rem;
    }
    .full-insurance1,
    .km1,
    .real-time-rate-shopping1,
    .single-truck1 {
      font-size: 1rem;
    }
    .premium {
      font-size: 1.125rem;
    }
    .style-guide-changelog {
      font-size: 1.563rem;
    }
    .month2 {
      font-size: 1.125rem;
    }
    .double-truck,
    .full-insurance2,
    .real-time-rate-shopping2,
    .unlimitted {
      font-size: 1rem;
    }
    .pricing-text {
      gap: 4rem 0;
    }
    .frequently-asked-questions {
      font-size: 1.313rem;
    }
    .can-i-specify,
    .how-can-i,
    .what-options-for,
    .what-payment-methods1,
    .you-need-any {
      font-size: 1rem;
    }
    .background1 {
      flex-wrap: wrap;
    }
    .address {
      padding: 2.125rem 1.25rem;
      box-sizing: border-box;
    }
    .free-consultation-button-frame {
      padding-top: 2.438rem;
      box-sizing: border-box;
    }
    .out-of-the-container,
    .points-one,
    .studio-green {
      font-size: 1rem;
    }
  }
  
  
  
  
  
  
  .header{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, .1);
      z-index: 2;
  
     
  }
  
  /* Add a black background color to the top navigation */
  .topnav {
    background-color: rgba(0, 0, 0, .3);
    overflow: hidden;
    display: flex;
    align-items: center;
  
  
  
  }
  
  
  .topnav a img{
    height: 2rem;
    object-fit: cover;
  }
  
  
  
  /* Style the links inside the navigation bar */
  .topnav a {
    float: left;
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
  }
  
  .menu{
    margin-left: 16rem;
    display: flex;
    flex-direction: row;
  }
  
  .menu .menu-search{
    margin-left: 19rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  
  
  .menu .menu-search input {
    max-width: 0;
    border-radius: 5px 5px 5px 5px;
    height: 2.8rem;
    border: none;
    position: absolute;
    top: 3.5rem;
    right: 19rem;
    background-color: rgba(255, 255, 255, 0.7);
    transition: max-width 0.9s ease;
    width: 0;
  }
  
  .search_box {
    opacity: 0;
    visibility: hidden;
    max-width: 0;
    border-radius: 5px;
    height: 10rem;
    border: none;
    position: absolute;
    top: 6.5rem;
    right: 19rem;
    background-color: rgba(255, 255, 255, 0.7);
    transition: max-width 0.5s ease, opacity 0.9s ease;
    width: 0;
  }
  
  
  .menu .menu-search .searchshow:hover input,
  .menu .menu-search input:focus {
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;
  
  
  }
  .menu .menu-search .searchshow:hover .search_box{
    opacity: 1;
    visibility: visible;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;
  
  }
  
  
  .heart-products{  
    max-width: 0;
    border-radius: 5px 5px 5px 5px;
    height: 10rem;
    border: none;
    position: absolute;
    top: 3.5rem;
    right: 16rem;
    background-color: rgba(255, 255, 255, 0.7);
    transition: max-width 0.9s ease;
    width: 0;
  }
  .cart-products{  
    max-width: 0;
    border-radius: 5px 5px 5px 5px;
    height: 10rem;
    border: none;
    position: absolute;
    top: 3.5rem;
    right: 12rem;
    background-color: rgba(255, 255, 255, 0.7);
    transition: max-width 0.9s ease;
    width: 0;
  }
  
  .setting-products{  
    opacity: 0;
    visibility: hidden;
    max-height: 0;
    border-radius: 5px;
    height: 10rem;
    border: none;
    position: absolute;
    top: 3.5rem;
    right: 12rem;
    background-color: rgba(255, 255, 255, 0.7);
    transition: max-height 0.5s ease, opacity 0.9s ease;
    height: 0;
  }
  
  
  .menu .menu-search .heartshow:hover .heart-products{
    opacity: 1;
    visibility: visible;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;
  }
  .menu .menu-search .cartshow:hover .cart-products{
    opacity: 1;
    visibility: visible;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;
  }
  .menu .menu-search .settingshow:hover .setting-products{
    opacity: 1;
    visibility: visible;
    width: 16rem;
    height: 24rem;
    max-height: 24rem;
    border: 1px solid black;
  }
  
  .menu .menu-search a{
    
    color: orange;
  }
  
  
  
  /* Add an active class to highlight the current page */
  
  
  /* Hide the link that should open and close the topnav on small screens */
  .topnav .icon {
    display: none;
  }
  
  /* Dropdown container - needed to position the dropdown content */
  .dropdown {
    float: left;
    overflow: hidden;
  }
  
  /* Style the dropdown button to fit inside the topnav */
  .dropdown .dropbtn {
    font-size: 17px;
    border: none;
    outline: none;
    color: white;
    padding: 14px 16px;
    background-color: inherit;
    font-family: inherit;
    margin: 0;
  }
  
  /* Style the dropdown content (hidden by default) */
  .dropdown-content {
    max-height: 0;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 0px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    display: flex;
    transition: max-height 0.3s ease-in, opacity 0.5s ease-in, visibility 0.3s ease-in;
    gap: 3rem;
   
  }
  
  
  .dropdown-content ul{
    list-style: none;
    line-height: 20px;
    margin-top: 1rem;
    margin-left: 1rem;
    cursor: pointer;
  }
  
  /* Style the links inside the dropdown */
  .dropdown-content a {
    float: none;
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
  }
  
  /* Add a dark background on topnav links and the dropdown button on hover */
  .topnav a:hover, .dropdown:hover .dropbtn {
    background-color: #555;
    color: white;
  }
  
  /* Add a grey background to dropdown links on hover */
  .dropdown-content a:hover {
    background-color: #ddd;
    color: black;
  }
  
  /* Show the dropdown menu when the user moves the mouse over the dropdown button */
  .dropdown:hover .dropdown-content {
    max-height: 20em;
    opacity: 1;
    visibility: visible;
    display: flex;
    gap: 3rem;
  }
  /* When the screen is less than 600 pixels wide, hide all links, except for the first one ("Home"). Show the link that contains should open and close the topnav (.icon) */
  @media screen and (max-width: 321px) and (min-width: 200px){
    .topnav a:not(:first-child), .dropdown .dropbtn {
      display: none;
    }
    .topnav .menu{
      background-color: black;
    }
  
    .topnav .menu .active{
      display: none;
    }
  
  
    .topnav.responsive .logo-img{
      width: 24rem;
    }
    .topnav a.icon {
      float: right;
      display: block;
    }
   
  
    .topnav .menu .menu-search{
      display: none;
    }
    .topnav.responsive .menu .menu-search{
      display: block;
    }
  
    .menu{
      margin-left: 0;
      display: block;
      width: 20rem;
    }
    .topnav.responsive .menu .menu-search{
      margin-left: 0;
  
    }
  
    .menu .menu-search input{
      left: .7rem;
      top: 0;
    }
    .menu .menu-search .search_box{
      left: .7rem;
      top: 0;
    }
    .menu .heartshow .heart-products{
      left: .7rem;
      top: 0;
    }
    .menu .cartshow .cart-products{
      left: .7rem;
      top: 0;
    }
    .menu .settingshow .setting-products{
      left: .7rem;
      top: 0;
    }
    .menu .menu-search .searchshow:hover input,
  .menu .menu-search input:focus {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
    .menu .menu-search .searchshow:hover .search_box {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
    .menu .heartshow:hover .heart-products {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
   .menu .cartshow:hover .cart-products {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
  .settingshow:hover ~ .cartshow{
    display: none; 
  }
    .menu .settingshow:hover .setting-products {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
  }
  
  /* The "responsive" class is added to the topnav with JavaScript when the user clicks on the icon. This class makes the topnav look good on small screens (display the links vertically instead of horizontally) */
  @media screen and (max-width: 321px) and (min-width: 200px){
    .topnav{
      display: flex;
      justify-content: space-between;
      background-color: black;
      overflow-y: auto;
      max-height: 40rem;
    }
    .topnav.responsive {position: relative; flex-direction: column; background-color: black;}
    .topnav.responsive a.icon {
      position: absolute;
      left: 86%;
      top: .3rem;
    }
    .topnav.responsive a {
      float: none;
      display: block;
      text-align: left;
      width: 20rem;
  
    }
  
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
      overflow-y: auto;
      max-height: 12rem;
    }
  
    .topnav.responsive .dropdown:hover .dropdown-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .topnav.responsive .dropdown .dropdown-content ul li{
      display: none;
    }
    .topnav.responsive .dropdown .dropdown-content ul:hover li{
      display: block;
    }
    .topnav.responsive .dropdown .dropdown-content ul{
      line-height: 10px;
    }
    
      
    }
    .topnav.responsive .dropdown {float: none;}
    .topnav.responsive .dropdown-content {position: relative; width: 20rem;}
    .topnav.responsive .dropdown .dropbtn {
      display: block;
      width: 100%;
      text-align: left;
     
  }
  @media screen and (max-width: 376px) and (min-width: 321px){
    .topnav a:not(:first-child), .dropdown .dropbtn {
      display: none;
    }
    .topnav .menu{
      background-color: black;
    }
  
    .topnav .menu .active{
      display: none;
    }
    .topnav a.icon {
      float: right;
      display: block;
    }
  
    .topnav .menu .menu-search{
      display: none;
    }
    .topnav.responsive .menu .menu-search{
      display: block;
    }
  
    .menu{
      margin-left: 0;
      display: block;
      width: 24rem;
    }
    .topnav.responsive .menu .menu-search{
      margin-left: 0;
  
    }
  
    .menu .menu-search input{
      left: .7rem;
      top: 0;
    }
    .menu .menu-search .search_box{
      left: .7rem;
      top: 0;
    }
    .menu .heartshow .heart-products{
      left: .7rem;
      top: 0;
    }
    .menu .cartshow .cart-products{
      left: .7rem;
      top: 0;
    }
    .menu .settingshow .setting-products{
      left: .7rem;
      top: 0;
    }
    .menu .menu-search .searchshow:hover input,
  .menu .menu-search input:focus {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
    .menu .menu-search .searchshow:hover .search_box {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
    .menu .heartshow:hover .heart-products {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
   .menu .cartshow:hover .cart-products {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
  .settingshow:hover ~ .cartshow{
    display: none; 
  }
    .menu .settingshow:hover .setting-products {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
  .ingridientlist{
    margin-left: 0;
  }
  .leftingridients h2{
    margin-left: 1.5rem;
  }
  .leftingridients .ingridientcard.third{
    margin-left: 0rem;
  }
  .ingredients .rightingridients img{
    margin-left: 10%;
  }
  .customerreviewlist{
    margin-left: -2rem;
  }
  
  }
  
  /* The "responsive" class is added to the topnav with JavaScript when the user clicks on the icon. This class makes the topnav look good on small screens (display the links vertically instead of horizontally) */
  @media screen and (max-width: 376px) and (min-width: 321px){
    .topnav{
      display: flex;
      justify-content: space-between;
      background-color: black;
      overflow-y: auto;
      max-height: 30rem;
    }
    .topnav.responsive {position: relative; flex-direction: column; background-color: black;}
    .topnav.responsive a.icon {
      position: absolute;
      left: 89%;
      top: .9rem;
    }
    .topnav.responsive a {
      float: none;
      display: block;
      text-align: left;
      width: 26rem;
  
    }
  
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
      overflow-y: auto;
      max-height: 12rem;
    }
  
    .topnav.responsive .dropdown:hover .dropdown-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .topnav.responsive .dropdown .dropdown-content ul li{
      display: none;
    }
    .topnav.responsive .dropdown .dropdown-content ul:hover li{
      display: block;
    }
    .topnav.responsive .dropdown .dropdown-content ul{
      line-height: 10px;
    }
    
      
    }
    .topnav.responsive .dropdown {float: none;}
    .topnav.responsive .dropdown-content {position: relative; width: 26rem;}
    .topnav.responsive .dropdown .dropbtn {
      display: block;
      width: 100%;
      text-align: left;
     
  }
  @media screen and (max-width: 600px) and (min-width: 376px){
    .topnav a:not(:first-child), .dropdown .dropbtn {
      display: none;
    }
    .topnav .menu{
      background-color: black;
    }
  
    .topnav .menu .active{
      display: none;
    }
    .topnav a.icon {
      float: right;
      display: block;
    }
  
    .topnav .menu .menu-search{
      display: none;
    }
    .topnav.responsive .menu .menu-search{
      display: block;
    }
  
    .menu{
      margin-left: 0;
      display: block;
      width: 24rem;
    }
    .topnav.responsive .menu .menu-search{
      margin-left: 0;
  
    }
  
    .menu .menu-search input{
      left: .7rem;
      top: 0;
    }
    .menu .menu-search .search_box{
      left: .7rem;
      top: 0;
    }
    .menu .heartshow .heart-products{
      left: .7rem;
      top: 0;
    }
    .menu .cartshow .cart-products{
      left: .7rem;
      top: 0;
    }
    .menu .settingshow .setting-products{
      left: .7rem;
      top: 0;
    }
    .menu .menu-search .searchshow:hover input,
  .menu .menu-search input:focus {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
    .menu .menu-search .searchshow:hover .search_box {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
    .menu .heartshow:hover .heart-products {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
   .menu .cartshow:hover .cart-products {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
  .settingshow:hover ~ .cartshow{
    display: none; 
  }
    .menu .settingshow:hover .setting-products {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
  }
  
  /* The "responsive" class is added to the topnav with JavaScript when the user clicks on the icon. This class makes the topnav look good on small screens (display the links vertically instead of horizontally) */
  @media screen and (max-width: 600px) and (min-width: 376px){
    .topnav{
      display: flex;
      justify-content: space-between;
      background-color: black;
      overflow-y: auto;
      max-height: 40rem;
    }
    .topnav.responsive {position: relative; flex-direction: column; background-color: black;}
    .topnav.responsive a.icon {
      position: absolute;
      left: 89%;
      top: .9rem;
    }
    .topnav.responsive a {
      float: none;
      display: block;
      text-align: left;
      width: 26rem;
  
    }
  
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
      overflow-y: auto;
      max-height: 12rem;
    }
  
    .topnav.responsive .dropdown:hover .dropdown-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .topnav.responsive .dropdown .dropdown-content ul li{
      display: none;
    }
    .topnav.responsive .dropdown .dropdown-content ul:hover li{
      display: block;
    }
    .topnav.responsive .dropdown .dropdown-content ul{
      line-height: 10px;
    }
    
      
    }
    .topnav.responsive .dropdown {float: none;}
    .topnav.responsive .dropdown-content {position: relative; width: 26rem;}
    .topnav.responsive .dropdown .dropbtn {
      display: block;
      width: 100%;
      text-align: left;
     
  }
  @media screen and (max-width: 800px) and (min-width: 601px){
    .topnav a:not(:first-child), .dropdown .dropbtn {
      display: none;
    }
    .topnav .menu{
      background-color: black;
    }
  
    .topnav.responsive .logo-img{
     width: 45rem;
    }
  
    .topnav .menu .active{
      display: none;
    }
    .topnav a.icon {
      float: right;
      display: block;
    }
  
    .topnav .menu .menu-search{
      display: none;
    }
    .topnav.responsive .menu .menu-search{
      display: block;
    }
  
    .menu{
      margin-left: 0;
      display: block;
      width: 40rem;
    }
    .topnav.responsive .menu .menu-search{
      margin-left: 0;
  
    }
  
    .menu .menu-search input{
      left: .7rem;
      top: 0;
    }
    .menu .menu-search .search_box{
      left: .7rem;
      top: 0;
    }
    .menu .heartshow .heart-products{
      left: .7rem;
      top: 0;
    }
    .menu .cartshow .cart-products{
      left: .7rem;
      top: 0;
    }
    .menu .settingshow .setting-products{
      left: .7rem;
      top: 0;
    }
    .menu .menu-search .searchshow:hover input,
  .menu .menu-search input:focus {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
    .menu .menu-search .searchshow:hover .search_box {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
    .menu .heartshow:hover .heart-products {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
   .menu .cartshow:hover .cart-products {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
  
    .menu .settingshow:hover .setting-products {
    position: relative;
    width: 24rem;
    max-width: 24rem;
    border: 1px solid black;  
  }
  }
  
  /* The "responsive" class is added to the topnav with JavaScript when the user clicks on the icon. This class makes the topnav look good on small screens (display the links vertically instead of horizontally) */
  @media screen and (max-width: 800px) and (min-width: 601px){
    .topnav{
      display: flex;
      justify-content: space-between;
      background-color: black;
      overflow-y: auto;
      max-height: 50rem;
    }
    .topnav.responsive{
      display: flex;
      justify-content: space-between;
      background-color: black;
      overflow-y: auto;
      max-height: 40rem;
    }
    .topnav.responsive {position: relative; flex-direction: column; background-color: black;}
    .topnav.responsive a.icon {
      position: absolute;
      left: 89%;
      top: .9rem;
    }
    .topnav.responsive a {
      float: none;
      display: block;
      text-align: left;
      width: 26rem;
  
    }
  
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
      overflow-y: auto;
      max-height: 12rem;
    }
  
    .topnav.responsive .dropdown:hover .dropdown-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .topnav.responsive .dropdown .dropdown-content ul li{
      display: none;
    }
    .topnav.responsive .dropdown .dropdown-content ul:hover li{
      display: block;
    }
    .topnav.responsive .dropdown .dropdown-content ul{
      line-height: 10px;
    }
    
      
    }
    .topnav.responsive .dropdown {float: none;}
    .topnav.responsive .dropdown-content {position: relative; width: 40rem;}
    .topnav.responsive .dropdown .dropbtn {
      display: block;
      width: 100%;
      text-align: left;
     
  }
  
  
  
  
  
  
  
  
  
    @media only screen and (min-width: 200px) and (max-width:321px){
   
  
  
  
  
  
  
  
      .slide_featuress i{
       font-size: 70%;
      }
      .slide_featuress{
        margin-top: -1rem;
      }

      .wrapper-images{
        width: 100%;
       }

       .images-icon{
        transform: scale(12);
        margin-left:1.4rem;
       }

       .leverage-agile-frameworks{
        width: 21rem;
       }

       .content1{
        margin-left:2rem;
        gap: 1rem;
       }

       .sed-ut-perspiciatis{
        width: 21rem;
       }

       .content2{
        margin-left:4rem;
       }
  
  
  
  
      main .product-title{
        font-size: 1rem;
      }
  
   
      
  
  
  
  
  
  
  
    
  
  
      .product-card .product-image{
        height: 4rem;
      }
      .product-slider .product-card{
        width: 200px;
      }
      .product-card .product-title{
        font-size: 0.8em;
      }
      .product-card .product-price{
        font-size: 0.8em;
      }
  
  
  
  
      footer .row{
        flex-direction: column;
        align-items: center;
      }
    
      footer .column{
       width: 14rem;
       text-align: center;
      }
    
      footer .sliderfeatureproducts .product-image{
        height: 5rem;
     
      }
      footer .sliderfeatureproducts .product-card{
        width: 200px;
        padding: 0px;
        margin: auto;
      }
      footer .slidermostviewproducts .product-card{
        width: 200px;
        padding: 0px;
        margin: auto;
      }
      
      footer .row2 h3{
        font-size: 1rem;
        text-align: center;
        border-left: 1px solid grey;
      }
      footer .row2{
        flex-direction: column;
        align-items: center;
      }
  
      .overlay .overlay_container{
        flex-direction: column;
      }
  
      .overlay .overlay_container{
        overflow-y: auto;
       }
    
       .overlay .overlay_container .right{
        flex: 0 0 50%;
       }
       .overlay .overlay_container .left{
        flex: 0 0 10%;
       }
  
       .overlay .overlay_container .left .overlay_img{
        height: 15rem;
        width: 10rem;
        margin-bottom: 2rem;
       }
       .overlay .overlay_container .left .overlay_img2{
        height: 5rem;
        width: 15rem;
        margin: auto;
        margin-bottom: 2rem;
       }
       .overlay .overlay_container .left .overlay_img img{
        height: 15rem;
       }
       .overlay .overlay_container .left .overlay_img2 img{
        height: 5rem;
       }
  
       .add-to-cart{
        margin: auto;
       }
  
       main{
        overflow: hidden;
       }
  
       .our-mission{
        width: 113%;
        height: 250vh;
        background-color: rgb(243, 243, 243);
        padding-top: 7rem;
      }
    
      .ourmission{
        height: 250vh;
        width: 80%;
        margin-left: 1rem;
      }
  
      .ourmissioncardlist{
        flex-direction: column;
        align-items: center;
        width: 100%;
      }
  
      .ourmissioncard{
        width: 80%;
        margin-top: 2rem;
      }
  
  
      main .our-story{
        flex-direction: column;
        margin-top: 2rem;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        width: 24rem;
      }
    
      .our-perfumes{
        width: 113%;
        height: 200vh;
        background-color: rgb(243, 243, 243);
        padding-top: 7rem;
      }
  
      .ourperfume{
        margin-left: 0;
        height: 200rem;
      }
  
      .ourperfumecardlist{
        flex-direction: column;
        gap: 150px;
      }
  
      .ourperfumecard{
        width: 100%;
        height: 20rem;
      }
  
      .our-perfumes img{
        height: 10rem;
      }
    
      .ourperfume{
        width: 90%;
      }
      .ingredients{
        width: 65%;
        height: 80rem;
        background-color: rgba(0, 0, 0, 0.3);
        
        border-radius: 20px; 
        display: flex;
        font-size: 50%;
  
        flex-direction: column;
        margin-left: -2rem;
      }
  
     
  
      .rightingridients{
        flex: 0 0 100%;
      }
    
      .rightingridients img{
        height: 20rem;
        width: 70%;
        margin-left: 15%;
        margin-top: -5rem;
      }
      .sustainibility{
        width: 16rem;
        height: 44rem;
          background-color: rgba(0, 0, 0, 0.3);
        margin: auto;
        margin-top: 5rem;
        margin-bottom: 3rem;
        border-radius: 20px; 
      }
    
      .sustainibility h2{
        margin-left: -3rem;
      }
    
      .first{
        margin-left: 0rem;
      }
  
      .sustainibilitylist{
        flex-direction: column;
        width: 100%;
        margin-left: -3rem;
      }
  
      .sustainibilitycard{
        width: 90%;
      }
    
      .customerreviewcard{
        height: 18rem;
        width: 90%;
      }
    
      .shippingdetail{
        width: 16rem;
        height: 40rem;
          background-color: rgba(0, 0, 0, 0.3);
        margin: auto;
        margin-top: 0rem;
        margin-bottom: 2rem;
        border-radius: 20px; 
        display: flex;
        gap: 40px;
  
        flex-direction: column;
      }
    
      .shippingdetail img{
        height: 80%;
        display: none;
      }
    
      .our-story {
        text-align: center;
        padding: 50px 0;
          background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
      }
    
      .our-story img{
        width: 70%;
        height: 16rem;
      }
    
      .ourstory{
        width: 250px;
        text-align: left;
      }
  
      .aboutusmore{
        width: 425px;
        overflow: hidden;
      }
  
      .customerreviewlist{
        width: 16rem;
        flex-direction: column;
      }
  
      .ingridientlist{
        height: 30rem;
        flex-direction: column;
        margin-left: 0;
        margin-bottom: 0;
        gap: 0;
      }
  
      .ingridientcard{
        width: 100%;
      }
  
  }
  
    @media only screen and (min-width: 321px) and (max-width:424px){
  
      .slide_featuress i{
        font-size: 70%;
       }
       .slide_featuress{
        margin-top: -1.2rem;
       }

       
       .wrapper-images{
        width: 100%;
       }

       .images-icon{
        transform: scale(4);
        margin-left:1.4rem;
       }

       .leverage-agile-frameworks{
        width: 21rem;
       }

       .content1{
        margin-left:2rem;
        gap: 1rem;
       }

       .sed-ut-perspiciatis{
        width: 21rem;
       }

       .content2{
        margin-left:4rem;
       }
  
  
  
  
      main .product-title{
        font-size: 1rem;
      }
  
   
  
      main .product-title{
        font-size: 1rem;
      }
  
  
      
  
      
  
  
  
  
   
  
     
  
    
  
      .product-card .product-image{
        height: 4rem;
      }
      .product-slider .product-card{
        width: 300px;
      }
      .product-card .product-title{
        font-size: 0.8em;
      }
      .product-card .product-price{
        font-size: 0.8em;
      }
  
  
     
  
  
  
    
     
      footer .row{
        flex-direction: column;
        align-items: center;
      }
    
      footer .column{
       width: 14rem;
       text-align: center;
      }
    
      footer .sliderfeatureproducts .product-image{
        height: 5rem;
     
      }
      footer .sliderfeatureproducts .product-card{
        width: 200px;
        padding: 0px;
        margin: auto;
      }
      footer .slidermostviewproducts .product-card{
        width: 200px;
        padding: 0px;
        margin: auto;
      }
      
      footer .row2 h3{
        font-size: 1rem;
        text-align: center;
        border-left: 1px solid grey;
      }
      footer .row2{
        flex-direction: column;
        align-items: center;
      }
  
      .overlay .overlay_container{
        flex-direction: column;
      }
  
      .overlay .overlay_container{
        overflow-y: auto;
       }
    
       .overlay .overlay_container .right{
        flex: 0 0 50%;
       }
       .overlay .overlay_container .left{
        flex: 0 0 10%;
       }
  
       .overlay .overlay_container .left .overlay_img{
        height: 15rem;
        width: 10rem;
        margin-bottom: 2rem;
       }
       .overlay .overlay_container .left .overlay_img2{
        height: 5rem;
        width: 15rem;
        margin: auto;
        margin-bottom: 2rem;
       }
       .overlay .overlay_container .left .overlay_img img{
        height: 15rem;
       }
       .overlay .overlay_container .left .overlay_img2 img{
        height: 5rem;
       }
  
       .add-to-cart{
        margin: auto;
       }
  
       main{
        overflow: hidden;
       }
  
       .our-mission{
        width: 113%;
        height: 220vh;
        background-color: rgb(243, 243, 243);
        padding-top: 7rem;
      }
    
      .ourmission{
        height: 220vh;
        width: 80%;
        margin-left: 1rem;
      }
  
      .ourmissioncardlist{
        flex-direction: column;
        align-items: center;
        width: 100%;
      }
  
      .ourmissioncard{
        width: 80%;
        margin-top: 2rem;
      }
  
  
      main .our-story{
        flex-direction: column;
        margin-top: 2rem;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        width: 24rem;
      }
    
      .our-perfumes{
        width: 113%;
        height: 200vh;
        background-color: rgb(243, 243, 243);
        padding-top: 7rem;
      }
  
      .ourperfume{
        margin-left: 0;
        height: 200rem;
      }
  
      .ourperfumecardlist{
        flex-direction: column;
        gap: 150px;
      }
  
      .ourperfumecard{
        width: 100%;
        height: 20rem;
      }
  
      .our-perfumes img{
        height: 10rem;
      }
    
      .ourperfume{
        width: 90%;
      }
      .ingredients{
        width: 85%;
        height: 60rem;
        background-color: rgba(0, 0, 0, 0.3);
        margin: auto;
        
        border-radius: 20px; 
        display: flex;
        font-size: 50%;
  
        flex-direction: column;
      }
  
     
  
      .rightingridients{
        flex: 0 0 100%;
      }
    
      .rightingridients img{
        height: 20rem;
        width: 70%;
        margin-left: 15%;
        margin-top: -5rem;
      }
      .sustainibility{
        width: 16rem;
        height: 44rem;
          background-color: rgba(0, 0, 0, 0.3);
        margin: auto;
        margin-top: 5rem;
        margin-bottom: 3rem;
        border-radius: 20px; 
      }
    
      .sustainibility h2{
        margin-left: -2rem;
      }
    
      .first{
        margin-left: 0rem;
      }
  
      .sustainibilitylist{
        flex-direction: column;
        width: 100%;
        margin-left: -2rem;
      }
  
      .sustainibilitycard{
        width: 90%;
      }
    
      .customerreviewcard{
        height: 18rem;
        width: 90%;
      }
    
      .shippingdetail{
        width: 16rem;
        height: 40rem;
          background-color: rgba(0, 0, 0, 0.3);
        margin: auto;
        margin-top: 0rem;
        margin-bottom: 2rem;
        border-radius: 20px; 
        display: flex;
        gap: 40px;
  
        flex-direction: column;
      }
    
      .shippingdetail img{
        height: 80%;
        display: none;
      }
    
      .our-story {
        text-align: center;
        padding: 50px 0;
          background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
      }
    
      .our-story img{
        width: 70%;
        height: 16rem;
      }
    
      .ourstory{
        width: 350px;
        text-align: left;
      }
  
      .aboutusmore{
        width: 425px;
        overflow: hidden;
      }
  
      .customerreviewlist{
        width: 16rem;
        flex-direction: column;
      }
  
      .ingridientlist{
        height: 20rem;
        flex-direction: column;
        margin-left: none;
        margin-bottom: 0;
        gap: 0;
      }
  
      .ingridientcard{
        width: 100%;
      }
  
      .rightshippingdetails ul{
        margin-left: 2rem;
      }
  
      .rightshippingdetails{
        flex: 0 0 100%;
      }
  
      .shippingdetail{
        width: 19rem;
      }
  
  }
  
  @media only screen and (min-width: 424px) and (max-width: 500px){
    
  
      .slide_featuress i{
        font-size: 90%;
       }
  
       .slide_featuress{
        margin-top: -1.2rem;
       }

       .wrapper-images{
        width: 100%;
       }

       .images-icon{
        transform: scale(3);
        margin-left:1.4rem;
       }

       .leverage-agile-frameworks{
        width: 21rem;
       }

       .content1{
        margin-left:2rem;
        gap: 1rem;
       }

       .sed-ut-perspiciatis{
        width: 21rem;
       }

       .content2{
        margin-left:7rem;
       }
  
  
  
      
  
  
  
  
     
  
  
      .product-card .product-image{
        height: 4rem;
      }
      .product-slider .product-card{
        width: 350px;
      }
      .product-card .product-title{
        font-size: 0.8em;
      }
      .product-card .product-price{
        font-size: 0.8em;
      }
  
  
    
  
  
      footer .row{
        flex-direction: column;
        align-items: center;
      }
    
      footer .column{
       width: 15rem;
       text-align: center;
      }
    
      footer .sliderfeatureproducts .product-image{
        height: 5rem;
     
      }
      footer .sliderfeatureproducts .product-card{
        width: 200px;
        padding: 0px;
        margin: auto;
      }
      footer .slidermostviewproducts .product-card{
        width: 200px;
        padding: 0px;
        margin: auto;
      }
      
      footer .row2 h3{
        font-size: 1rem;
        text-align: center;
        border-left: 1px solid grey;
      }
      footer .row2{
        flex-direction: column;
        align-items: center;
      }
  
      .overlay .overlay_container{
        flex-direction: column;
      }
  
      .overlay .overlay_container{
        overflow-y: auto;
       }
    
       .overlay .overlay_container .right{
        flex: 0 0 50%;
       }
       .overlay .overlay_container .left{
        flex: 0 0 10%;
       }
  
       .overlay .overlay_container .left .overlay_img{
        height: 15rem;
        width: 10rem;
        margin-bottom: 2rem;
       }
       .overlay .overlay_container .left .overlay_img2{
        height: 5rem;
        width: 15rem;
        margin: auto;
        margin-bottom: 2rem;
       }
       .overlay .overlay_container .left .overlay_img img{
        height: 15rem;
       }
       .overlay .overlay_container .left .overlay_img2 img{
        height: 5rem;
       }
  
       .add-to-cart{
        margin: auto;
       }
  
       .our-mission{
        width: 100%;
        height: 220vh;
        background-color: rgb(243, 243, 243);
        padding-top: 7rem;
      }
    
      .ourmission{
        height: 220vh;
        width: 90%;
      }
  
      .ourmissioncardlist{
        flex-direction: column;
        align-items: center;
        width: 100%;
      }
  
      .ourmissioncard{
        width: 80%;
        margin-top: 2rem;
      }
  
      main .our-story{
        flex-direction: column;
        margin-top: 2rem;
        align-items: center;
        justify-content: center;
      }
    
      .our-perfumes{
        width: 100%;
        height: 160vh;
        background-color: rgb(243, 243, 243);
        padding-top: 7rem;
      }
  
      .our-perfumes img{
        height: 20rem;
      }
    
      .ourperfume{
        width: 90%;
      }
      .ingredients{
        width: 95%;
        height: 60rem;
          background-color: rgba(0, 0, 0, 0.3);
        margin: auto;
        border-radius: 20px; 
        display: flex;
        font-size: 50%;
  
        flex-direction: column;
      }
  
      .rightingridients{
        flex: 0 0 100%;
      }
    
      .rightingridients img{
        height: 20rem;
        width: 70%;
        margin-left: 15%;
        margin-top: -5rem;
      }
      .sustainibility{
        width: 20rem;
        height: 44rem;
          background-color: rgba(0, 0, 0, 0.3);
        margin: auto;
        margin-top: 5rem;
        margin-bottom: 3rem;
        border-radius: 20px; 
      }
    
      .sustainibility h2{
        margin-left: 1rem;
      }
    
      .first{
        margin-left: 1rem;
      }
  
      .sustainibilitylist{
        flex-direction: column;
        width: 100%;
      }
  
      .sustainibilitycard{
        width: 90%;
      }
    
      .customerreviewcard{
        height: 18rem;
        width: 90%;
      }
    
      .shippingdetail{
        width: 20rem;
        height: 40rem;
          background-color: rgba(0, 0, 0, 0.3);
        margin: auto;
        margin-top: 0rem;
        margin-bottom: 2rem;
        border-radius: 20px; 
        display: flex;
        gap: 40px;
  
        flex-direction: column;
      }
    
      .shippingdetail img{
        height: 80%;
        display: none;
      }
    
      .our-story {
        text-align: center;
        padding: 50px 0;
          background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
      }
    
      .our-story img{
        width: 70%;
        height: 20rem;
      }
    
      .ourstory{
        width: 350px;
        text-align: left;
      }
  
      .aboutusmore{
        width: 425px;
      }
  
      .customerreviewlist{
        width: 20rem;
        flex-direction: column;
      }
  
      .ingridientlist{
        height: 20rem;
        flex-direction: column;
        margin-left: none;
        margin-bottom: 0;
        gap: 0;
      }
  
      .ingridientcard{
        width: 100%;
      }
  
  
    
  
    
  }
  
  
  
  @media only screen and (min-width: 760px) and (max-width: 800px){
      
  
      .slide_featuress i{
        font-size: 90%;
       }
  
       .slide_featuress{
        margin-top: -1.2rem;
       }
  
  
      main .product-title{
        font-size: 1rem;
      }

      .faq{
        margin-right: 10rem;
      }
  
  
   
  
      .product-card .product-image{
        height: 4rem;
      }
      .product-slider .product-card{
        width: 152px;
      }
      .product-card .product-title{
        font-size: 0.8em;
      }
      .product-card .product-price{
        font-size: 0.8em;
      }
    
  
      
    
    footer .row{
      flex-direction: column;
      align-items: center;
    }
  
    footer .column{
     width: 30rem;
     text-align: center;
    }
  
    footer .sliderfeatureproducts .product-image{
      height: 5rem;
   
    }
    footer .sliderfeatureproducts .product-card{
      width: 250px;
      padding: 0px;
      margin: auto;
    }
    footer .slidermostviewproducts .product-card{
      width: 15.625rem;
      padding: 0px;
      margin: auto;
    }
    
    footer .row2 h3{
      font-size: .7rem;
      width: 2rem;
    }
    .overlay .overlay_container{
      overflow-y: auto;
     }
  
     .overlay .overlay_container .right{
      flex: 0 0 50%;
     }
     .overlay .overlay_container .left{
      flex: 0 0 10%;
     }
  
     .left .overlay_img2{
      width: 20rem;
      margin-top: 4rem;
     }
  
     .left .overlay_img{
      width: 10rem;
     }
  
     .left .overlay_img img{
      height: 24rem;
     }
  
     .our-mission{
      width: 100%;
      height: 110vh;
      background-color: rgb(243, 243, 243);
      padding-top: 7rem;
    }
  
    .ourmission{
      height: 34rem;
      width: 90%;
    }
  
    .our-perfumes{
      width: 100%;
      height: 160vh;
      background-color: rgb(243, 243, 243);
      padding-top: 7rem;
    }
  
    .ourperfume{
      width: 90%;
    }
    .ingredients{
      width: 95%;
      height: 30rem;
        background-color: rgba(0, 0, 0, 0.3);
      margin: auto;
      border-radius: 20px; 
      display: flex;
      font-size: 50%;
    }
  
    .rightingridients img{
      height: 80%;
      width: 100%;
    }
    .sustainibility{
      width: 95%;
      height: 20rem;
        background-color: rgba(0, 0, 0, 0.3);
      margin: auto;
      margin-top: 5rem;
      margin-bottom: 3rem;
      border-radius: 20px; 
    }
  
    .sustainibility h2{
      margin-left: 1rem;
    }
  
    .first{
      margin-left: 1rem;
    }
  
    .customerreviewcard{
      height: 18rem;
    }
  
    .shippingdetail{
      width: 90%;
      height: 25rem;
        background-color: rgba(0, 0, 0, 0.3);
      margin: auto;
      margin-top: 10rem;
      margin-bottom: 2rem;
      border-radius: 20px; 
      display: flex;
      gap: 40px;
    }
  
    .shippingdetail img{
      height: 80%;
    }
  
    .our-story {
      text-align: center;
      padding: 50px 0;
        background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: center;
    }
  
    .our-story img{
      width: 70%;
    }
  
    .ourstory{
      width: 350px;
      text-align: left;
    }
  
  
    
  
     
  
   
  }
  
  @media only screen and (min-width: 1020px) and (max-width: 1030px){
      
  
      .product-card .product-image{
        height: 5rem;
      }
      .product-slider .product-card{
        width: 171px;
      }
      .product-card .product-title{
        font-size: 0.8em;
      }
      .product-card .product-price{
        font-size: 0.8em;
      }
  
      footer .sliderfeatureproducts .product-card{
        width: 158px;
        padding: 0px;
      }
      footer .slidermostviewproducts .product-card{
        width: 158px;
        padding: 0px;
      }
      footer .sliderfeatureproducts .product-card .product-title{
        font-size: .7rem;
      }
      footer .slidermostviewproducts .product-card .product-title{
        font-size: .7rem;
  
      
      }
       .menu{
        margin-left: 4rem;
       }
       .menu .menu-search{
        margin-left: 6rem;
       }
  
       .menu a{
        font-size: 1rem;
       }
  
       .menu .menu-search .heartshow .heart-products{
        right: 2rem;
       }
       .menu .menu-search .cartshow .cart-products{
        right: 2rem;
       }
       .menu .menu-search .settingshow .setting-products{
        right: 2rem;
       }
  
       .overlay .overlay_container{
        overflow-y: auto;
       }
  
       .overlay .overlay_container .right{
        flex: 0 0 50%;
       }
  
       .left .overlay_img2{
        width: 20rem;
        margin-top: 4rem;
       }
  
       .our-mission{
        width: 100%;
        height: 110vh;
        background-color: rgb(243, 243, 243);
        padding-top: 7rem;
      }
  
      .ourmission{
        height: 34rem;
      }
  
      .our-perfumes{
        width: 100%;
        height: 160vh;
        background-color: rgb(243, 243, 243);
        padding-top: 7rem;
      }
      .ingredients{
        width: 85%;
        height: 35rem;
          background-color: rgba(0, 0, 0, 0.3);
        margin: auto;
        border-radius: 20px; 
        display: flex;
      }
  
      .rightingridients img{
        height: 80%;
        width: 100%;
      }
      .sustainibility{
        width: 85%;
        height: 16rem;
          background-color: rgba(0, 0, 0, 0.3);
        margin: auto;
        margin-top: 5rem;
        margin-bottom: 3rem;
        border-radius: 20px; 
      }
  
      .customerreviewcard{
        height: 15rem;
      }
  
      .shippingdetail{
        width: 85%;
        height: 25rem;
          background-color: rgba(0, 0, 0, 0.3);
        margin: auto;
        margin-top: 10rem;
        margin-bottom: 2rem;
        border-radius: 20px; 
        display: flex;
        gap: 40px;
      }
    
    
  
      
    
  
  }
  /* header here */
  
  
    
    .product-info {
      text-align: center;
    }
    
    .product-title {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .product-subtitle {
      font-size: 16px;
      margin-bottom: 5px;
    }
    
    .product-price-old {
      font-size: 14px;
      text-decoration: line-through;
      margin-right: 10px;
    }
    
    .product-price-new {
      font-size: 16px;
      font-weight: bold;
      margin-right: 10px;
    }
    
    .product-rating {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
    
    .star {
      font-size: 18px;
      color: #f5a623;
      margin-right: 2px;
    }
  
  
  
   
  
  
    .slide_featuress{
      position: fixed;
      color: #f5a623;
      font-size: 1.5rem;
      line-height: 3.5rem;
      display: none;
      z-index: 99;
      animation: feature 0.3s ease-in-out forwards;
      transform: translateX(50%);
    }
  
    .slide_featuress i{
      height: 1.5rem;
      width: 1.5rem;
      border:1px solid orange;
      margin-left: .5rem;
    }
  
    .slide:hover .slide_featuress{
      display: block;
    }
    
    .slide_featuress i:hover{
      background-color: rgb(54, 50, 50);
    }
  
  
    
  
  
  @keyframes feature {
    0% {
      transform: translateX(50%);
    }
    100% {
      transform: translateX(0);
    }
  }
  
  .overlay {
    display: none;
    position: fixed; /* Position relative to the viewport */
    top: 10%; /* Adjust top position as needed */
    left: 15%; /* Adjust left position as needed */
    width: 70vw; /* Cover 50% of the viewport width */
    height: 89vh; /* Cover 70% of the viewport height */
    background-color: black; /* Semi-transparent black */
    z-index: 9999; /* Ensure it's above other content */
  
   
  }
  
  .overlay::-webkit-scrollbar {
    display: none; /* Hide scrollbar for WebKit-based browsers */
  }
  
  
  .website-content {
    margin-top: 50px; /* Adjust according to your design */
  }
  
  
  
  
  
  
  
  
  
  
  .text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: transparent;
    color: white;
    text-align: center;
    z-index: 99;
  
  
  
  
  }
  
  
  
  
  
  
  
  .text {
    position: relative; /* Change from absolute to relative */
    z-index: 2; /* Ensure text remains above the background */
  }
  
  
  .overlay_container {
   width: 100%;
   height: 100%;
    padding: 14px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: white;
    display: flex;
    flex-direction: row;
    width: 100%;  
  }
  
  .left {
    flex: 0 0 30%; /* flex-grow, flex-shrink, flex-basis */
    background-color: #ffffff;
  }
  
  .right {
    flex: 0 0 70%; /* flex-grow, flex-shrink, flex-basis */
    background-color: #ffffff;
  }
  
  #closeOverlayBtn{
    float: right;
    background: none;
    border: none;
    font-size: 1.5rem;
  
  }
  
  
  
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    margin-left: 10px;
  }
  
  .price {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #d30027;
    margin-left: 10px;
  
  }
  
  .description {
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    margin-bottom: 24px;
    margin-left: 10px;
  
  }
  
  .details-group {
    margin-bottom: 16px;
    margin-left: 10px;
  
  }
  
  .details-group label {
    font-size: 14px;
    font-weight: bold;
    display: block;
    margin-bottom: 8px;
  }
  
  .details-group span {
    font-size: 14px;
    color: #333;
  }
  
  .share-buttons {
    text-align: center;
    margin-bottom: 16px;
  }
  
  .share-button {
    display: inline-block;
    margin-right: 16px;
    font-size: 14px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-decoration: none;
    margin-top: 2rem;
  }
  
  .add-to-cart {
    width: 10rem;
    display: block;
    text-align: center;
    padding: 12px 24px;
    background-color: #d30027;
    color: white;
    font-size: 16px;
    font-weight: bold;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 2rem;
  }
  
  #group-size{
    width: 100%;
    height: 2rem;
  }
  
  
  
  
  
  /* Hide the images by default */
  
  
  
  .product-listing {
    font-family: Arial, sans-serif;
    width: 100%;
  }
  
  .product-card {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 250px;
    margin-bottom: 20px;
    text-align: center;
    margin-top: -1rem;
    padding: 15px;
  }
  
  .productinfohere{
    height: 100%;
    width: 100%;
    line-height: 30px;
  }
  
  .product-image {
    width: 5rem;
    height: 7rem;
    object-fit: cover;
  }
  
  .product-title {
    font-size: .8em;
    margin-bottom: 5px;
  }
  
  .product-price{
    font-size: .9em;
  }
  
  
  
  
  
  footer {
    width: 100%;
    background-color: #232222;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .row {
    display: flex;
    justify-content: space-between;
    margin-right: 10%;
    margin-left: 10%;
  }
  .row2 {
    display: flex;
    justify-content: flex-start;
    gap: 3rem;
    margin-right: 10%;
    margin-left: 10%;
  }
  
  .column {
    width: 20%;
    line-height: 35px;
    margin-top: 5rem;
  }
  
  .sliderfeatureproducts .product-image{
    height: 4rem;
  }
  .sliderfeatureproducts .product-card{
    width: 224px;
    padding: 0px;
  }
  .slidermostviewproducts .product-card{
    width: 224px;
    padding: 0px;
  }
  
  .slidermostviewproducts .product-image{
    height: 4rem;
  }
  
  .row2{
    margin-top: 4rem;
  }
  
  footer .row2 h3{
    width: 8rem;
    border-right: 1px solid gray;
  }
  
  .row3{
    margin-top: 2rem;
  }
  
  .row , .row2, .row3{
    color: white;
  }
  
  .slide{
    box-shadow: none;
  }
  
  
  .slick-prev9, .slick-next9 {
    z-index: 2;
  
  }
  
  .slick-prev9 {
    left: 0!important;
   
  }
  
  .slick-next9 {
    right: 0!important;
  }
  
  .overlay_img {
    text-align: center;
    width: 19rem;
    height: 70%;
    margin: 1rem auto;
    z-index: 2;
  
  }
  .overlay_img2 {
    width: 20rem;
    height: 30%;
    z-index: 1;
  
  }
  
  .overlay_img img{
    width: 100%;
    height: 100%;
  }
  .overlay_img2 img{
    height: 9rem;
  }
  
  .quantity #group-size{
    width: 12.5rem;
  }
  
  .share_product{
    width: 50%;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 3rem auto;
  }
  
  .share_product a{
    text-decoration: none;
    color: blue;
    font-size: 1.5rem;
  }
  
  
  
`;

const sliderSettings = {
    arrows:false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 4000, // Set autoplay speed in milliseconds (e.g., 2000 ms = 2 seconds)
    // variableWidth: true,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  

function AboutUs() {

  const sliderRef6 = useRef(null);
  

    return (
        <>
        <Header />
        <AboutUsContainer>
        <div className="about-us">
            <section className="header-frame">
            <div className="wrapper-images">
            <img
              className="images-icon"
              loading="lazy"
              alt=""
              src="../../public/shopImage.png"
            />
          </div>

          <div className="main-content-frame">
                <div className="nav-bar-frame">
  <div className="about-us-team-project-pricing">
    <div className="pattern"></div>
    <div className="text">
      <div className="about-us1">About Us</div>
    </div>
  </div>
  <div className="line-frame">
    <h2 className="our-company-overview">Our Company Overview</h2>
    <div className="leverage-agile-frameworks">
      Leverage agile frameworks to provide a robust synopsis for
      strategy foster collaborative thinking to further the overall
      value proposition.
    </div>
  </div>
                </div>
                <div className="call-us-text-btn">
  <div className="content">
    <div className="content1">
      <button className="transit-flow-home-page">
        <div className="our-approch">Our Approch</div>
      </button>
      <button className="transit-flow-home-page1">
        <div className="our-approch1">Our Approch</div>
      </button>
      <button className="transit-flow-home-page2">
        <div className="our-approch2">Our Approch</div>
      </button>
    </div>
    <div className="sed-ut-perspiciatis">
      Sed ut perspiciatis, unde omnis iste natus error sit voluptatem
      accusantium doloremque laudantium, totam rem aperiam eaque ipsa,
      quae ab illo inventore veritatis et quasi architecto beatae
      vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem quia
      voluptassit.
    </div>
  </div>
                </div>
                <div className="button">
              <img
                className="background-icon"
                loading="lazy"
                alt=""
                src="../../public/background.svg"
              />
  
              <div className="learn-more">Learn More</div>
                 </div>
                
            </div>
            </section>
            <section className="parentframelogo">
  <div className="services">
    <div className="contact-us-frame">
      <div className="transit-flow-footer">
        <div className="patterns-background">
          <div className="pattern1"></div>
          <div className="text1">
            <div className="what-we-do">What We Do</div>
          </div>
        </div>
        <h2 className="our-logistics-services">Our Perfume Services</h2>
      </div>
    </div>
    <div className="content2">
      <div className="team-name-frame">
        <img className="icon" loading="lazy" alt="" src="../../public/shipping.png" />

        <div className="text2">
          <div className="sea-transport-services">Efficient Transport Services</div>
          <div className="following-the-quality">
            Following the quality of our service thus having gained trust
            of our many clients.
          </div>
        </div>
      </div>
      <div className="team-name-frame1">
        <img className="icon1" alt="" src="../../public/warehouse.png" />

        <div className="text3">
          <div className="warehousing-services">Warehousing Services</div>
          <div className="following-the-quality1">
            Following the quality of our service thus having gained trust
            of our many clients.
          </div>
        </div>
      </div>
      <div className="team-name-frame2">
        <img className="icon2" alt="" src="../../public/fragnancelogistics.png" />

        <div className="text4">
          <div className="air-fright-services">Fragrance Logistics</div>
          <div className="following-the-quality2">
            Following the quality of our service thus having gained trust
            of our many clients.
          </div>
        </div>
      </div>
      <div className="team-name-frame3">
        <img className="icon3" alt="" src="../../public/expo.png" />

        <div className="text5">
          <div className="project-exhibition">Project & Exhibition</div>
          <div className="following-the-quality3">
            Following the quality of our service thus having gained trust
            of our many clients.
          </div>
        </div>
      </div>
      <div className="team-name-frame4">
        <img className="icon4" alt="" src="../../public/transport.png" />

        <div className="text6">
          <div className="local-shipping-services">
            Local Shipping Services
          </div>
          <div className="following-the-quality4">
            Following the quality of our service thus having gained trust
            of our many clients.
          </div>
        </div>
      </div>
      <div className="team-name-frame5">
        <img className="icon5" alt="" src="../../public/customerclearance.png" />

        <div className="text7">
          <div className="customer-clearance">Customer Clearance</div>
          <div className="following-the-quality5">
            Following the quality of our service thus having gained trust
            of our many clients.
          </div>
        </div>
      </div>
    </div>
    <div className="our-project-changelicenses">
      <div className="button1">
        <img
          className="background-icon1"
          alt=""
          src="../../public/background.svg"
        />

        <div className="more-works">More Works</div>
      </div>
    </div>
  </div>
            </section>
            <section className="studiogreen">
  <div className="icon-row">
    <div className="logo-image">
      <div className="pattern2"></div>
      <div className="text8">
        <div className="the-transporters">The Team</div>
      </div>
    </div>
    <h2 className="meet-expert-team">Perfume Experts</h2>
  </div>
  <div className="team">
    <div className="about-us-page">
      <div className="team-members-page">
        <img className="image-icon" alt="" src="../../public/image@2x.png" />

        <img
          className="social-media-icon"
          loading="lazy"
          alt=""
          src="../../public/social-media@2x.png"
        />
      </div>
      <div className="name">
        <img
          className="background-icon2"
          alt=""
          src="../../public/background.svg"
        />

        <div className="jessca-arow">Jessca Arow</div>
        <div className="designer">Designer</div>
      </div>
    </div>
    <div className="about-us-page1">
      <div className="image-parent">
        <img className="image-icon1" alt="" src="../../public/image-1@2x.png" />

        <img
          className="social-media-icon1"
          alt=""
          src="../../public/social-media-1@2x.png"
        />
      </div>
      <div className="name1">
        <img
          className="background-icon3"
          alt=""
          src="../../public/background.svg"
        />

        <div className="kathleen-smith">Kathleen Smith</div>
        <div className="designer1">Designer</div>
      </div>
    </div>
    <div className="about-us-page2">
      <div className="image-group">
        <img className="image-icon2" alt="" src="../../public/image-2@2x.png" />

        <img
          className="social-media-icon2"
          alt=""
          src="../../public/social-media-2@2x.png"
        />
      </div>
      <div className="name2">
        <img
          className="background-icon4"
          alt=""
          src="../../public/background.svg"
        />

        <a
          className="rebecca-tylor"
          href="https://kodesolution.com/2022/tronis/staff/rebecca-tylor/"
          target="_blank"
        >Rebecca Tylor</a>
        <div className="designer2">Designer</div>
      </div>
    </div>
  </div>
            </section>
            <section className="frame-lets-talk">
      <div className="testimonial">
        <div className="call-button-field">
          <div className="logistics-options">
            <div className="payment-methods">
              <div className="pattern3"></div>
              <div className="text9">
                <div className="testimonial1">Testimonial</div>
              </div>
            </div>
            <h2 className="what-our-customer">What Our Customer Say</h2>
          </div>
          <div className="what-payment-methods">
            <img
              className="logistic-details-icon"
              loading="lazy"
              alt=""
              src="../../public/logistic-details.svg"
              onClick={() => sliderRef6.current.slickPrev()} />

            <img
              className="logistic-details-icon1"
              alt=""
              src="../../public/-1.svg"
              onClick={() => sliderRef6.current.slickNext()}/>
          </div>
        </div>
     
          <Slider ref={sliderRef6} {...sliderSettings} className="user">
          <div className="frame-pages-utility-subscribe">
            <div className="review">
              <div className="user1">
                <div className="user2">
                  <img
                    className="user-icon"
                    loading="lazy"
                    alt=""
                    src="../../public/user@2x.png"
                  />

                  <div className="name3">
                    <div className="kathleen-smith1">Kathleen Smith</div>
                    <div className="fuel-company">Pinnacle Ventures</div>
                  </div>
                </div>
                <img className="footer-icon" alt="" src="../../public/-2.svg" />
              </div>
              <div className="text10">
                <i className="leverage-agile-frameworks1">
                To harness the essence of agility in the perfume industry, we strive to infuse our strategy with dynamic frameworks, fostering collaborative ideation to enhance our value proposition. Embracing diversity and empowerment within our workplace, we organically cultivate a holistic perspective on disruptive innovation, shaping a fragrance narrative that transcends boundaries and captivates the senses.
                </i>
                <img
                  className="star-icon"
                  loading="lazy"
                  alt=""
                  src="../../public/star.svg"
                />
              </div>
            </div>
          </div>
          <div className="frame-pages-utility-subscribe1">
            <div className="review1">
              <div className="user3">
                <div className="user4">
                  <img
                    className="user-icon1"
                    alt=""
                    src="../../public/user-1@2x.png"
                  />

                  <div className="name4">
                    <div className="john-martin">John Martin</div>
                    <div className="restoration-company">Arcadian Innovations</div>
                  </div>
                </div>
                <img className="icon6" alt="" src="../../public/-2.svg" />
              </div>
              <div className="text11">
                <i className="leverage-agile-frameworks2">
                To harness the essence of agility in the perfume industry, we strive to infuse our strategy with dynamic frameworks, fostering collaborative ideation to enhance our value proposition. Embracing diversity and empowerment within our workplace, we organically cultivate a holistic perspective on disruptive innovation, shaping a fragrance narrative that transcends boundaries and captivates the senses.
                </i>
                <img className="star-icon1" alt="" src="../../public/star.svg" />
              </div>
            </div>
          </div>
     
       </Slider>

   
      </div>
            </section>

            <section className="frame-parent1">
                <div className="faq">
                <div className="free-consultation-button-frame">
  <div className="support-f-a-q-frame">
    <img className="image-icon3" alt="" src="../../public/image-3@2x.png" />

    <div className="address">
      <div className="address1">
        <div className="pattern6">
          <div className="pattern7"></div>
          <div className="text14">
            <div className="lets-talk">Let’s Talk</div>
          </div>
        </div>
      </div>
      <div className="you-need-any">
        You need any help? get free consultation
      </div>
      <div className="contact-us">
        <div className="f-a-q-frame">
          <div className="background1">
            <img className="icon11" alt="" src="../../public/icon-10.svg" />

            <div className="have-any-questions-container">
              <p className="have-any-questions">Have Any Questions</p>
              <p className="p"> &nbsp; 976542159</p>
            </div>
          </div>
          <div className="button5">
            <img
              className="background-icon8"
              alt=""
              src="./public1/background.svg"
            />

            <img
              className="background-icon9"
              alt=""
              src="../../public/background-5.svg"
            />

            <div className="contact-us1"><Link to='/contact' style={{textDecoration:'none', color:'black'}}>Contact Us</Link></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
                </div>
            </section>

          


        </div>
        </AboutUsContainer>
        <Footer />
        </>
    );

}

export default AboutUs;