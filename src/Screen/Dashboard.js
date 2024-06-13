import React, { useState } from "react";
import LinkContainer, { SmallLink } from "../components/LinkContainer";

import { links } from "../lib/Links";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("DashBoard");
  const [activeSmallTab, setActiveSmallTab] = useState("");
  const onClickTab = (title) => {
    setActiveTab(title);
  };
  const onClickSmallTab = (title) => {
    setActiveSmallTab(title);
  };
  return (
    <div className="bg-[#D0D8DA] w-full h-screen overflow-auto overflow-x-hidden flex pt-[80px]">
      <div className="w-1/2 px-[76px]">
        <h1 className="text-4xl text-black text-left font-abril font-semibold mb-11">
          Welcome
        </h1>
        {links.map((link) => (
          <LinkContainer
            key={link.title}
            title={link.title}
            onClick={onClickTab}
            activeTab={activeTab}
          >
            {link.subLinks && (
              <div>
                {link.subLinks.map((subLink) => (
                  <SmallLink
                    key={subLink.title}
                    title={subLink.title}
                    path={subLink.path}
                    activeSmallTab={activeSmallTab}
                    onClick={onClickSmallTab}
                  />
                ))}
              </div>
            )}
          </LinkContainer>
        ))}
      </div>
      <div className="w-1/2 px-[76px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
