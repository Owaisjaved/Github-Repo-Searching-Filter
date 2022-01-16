import React, { useEffect, useState } from "react";
import axios from "axios";
export const Search = () => {
  
  /**
   * @States
   */
  //User Search Value
  const [search, setSearch] = useState("");
  // User Profile Data
  const [userdata, setUserData] = useState({});
  // User Repository Data
  const [repoData, setRepoData] = useState([]);
  // Filtered Data from Searched Value
  const [filterData, setFilterData] = useState([]);
  // Data Loading State
  const [loading, setLoading] = useState(true);

  /**
   * Destructuring Values from .env files
   * Changing values in .env files will give data according to credentials
   * Note : gitignore will probably ignore .env files,
   * So for testing purpose Give user name and github access token in substitute of REACT_APP_GITHUB_USERNAME & REACT_APP_GITHUB_ACCESS_TOKEN
   * Environment Variables:
     *REACT_APP_GITHUB_USERNAME = OwaisJaved
     *REACT_APP_GITHUB_ACCESS_TOKEN = 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
   */
  const {REACT_APP_GITHUB_USERNAME,REACT_APP_GITHUB_ACCESS_TOKEN} = process.env

  /** @function
   * A Function that Fetches User Github Data using GraphQl
   */
  const getUserGithub = async () => {
    let fetchedData = await axios.post(
      "https://api.github.com/graphql",
      {
        // Query to Get Required Values
        query: `{
                 user(login: "${REACT_APP_GITHUB_USERNAME}") {
                   id  
                   name
                   login
                   avatarUrl
                   location
                   login
                   bio
                   followers {
                     totalCount
                   }
                   following {
                     totalCount
                   }
                   repositories(first: 50) {
                     nodes {
                       id
                       name
                       description
                       languages(first: 10) {
                         nodes {
                           name
                         }
                       }
                       updatedAt
                     }
                     pageInfo {
                       hasNextPage
                     }
                   }
                 }
               }`,
      },
      {
        headers: { Authorization: `Bearer ${REACT_APP_GITHUB_ACCESS_TOKEN}` },
      }
    );

    // Setting Values For SetStates(userData)
    setUserData({
      id:fetchedData.data.data.user.id,
      name: fetchedData.data.data.user.name,
      avatar_url: fetchedData.data.data.user.avatarUrl,
      login: fetchedData.data.data.user.login,
      bio: fetchedData.data.data.user.bio,
      followers: fetchedData.data.data.user.followers.totalCount,
      following: fetchedData.data.data.user.following.totalCount,
      location: fetchedData.data.data.user.location,
    });
    // Setting Values For SetStates(repoData)
    console.log(fetchedData.data.data.user.repositories.nodes)
    setRepoData(fetchedData.data.data.user.repositories.nodes);
    // Data is Fetched So loading status change to False
    setLoading(false);
  };
  /** @function
   * A Function that Set values for States
   * User Searched value is Set First then Search state is matched with Repository Data State
   */
  const handleSearch = (e) => {
    setSearch(e.target.value);
    /**
     * Returns Searched Data
     * Checking User Searched Value in User Repository Data
     * @returns {array}
     */
    let filterData = repoData.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilterData(filterData);
  };

  // React UseEffect hook for Mounting Function
  useEffect(() => {
    getUserGithub();
  }, []);
  return (
    <div className="Main">
      <div className="Container">
        {/* Checking if Data is Available or Not */}
        {loading ? (
          <span>Loading...</span>
        ) : (
          <div className="left-side">
            <div className="user-image">
              <img src={userdata.avatar_url} alt="UserProfile"></img>
            </div>
            <div>
              <div className="bigText">{userdata.name}</div>
              <div className="normalText">{userdata.login}</div>
            </div>
            <div className="normalText">{userdata.bio}</div>
            <div className="profile-btn">Edit Profile</div>
            <div className="block">
              <div className="smallText">{userdata.followers} follower</div>
              <span className="smallText">.</span>
              <div className="smallText">{userdata.following} following</div>
            </div>
            <div>{userdata.location}</div>
          </div>
        )}
        <div className="right-side">
          <div className="repo-detail">{repoData.length} Repositories</div>
          <div id="searching">
            <input
              placeholder="Search Repo..."
              type={"search"}
              value={search}
              onChange={(e) => handleSearch(e)}
            ></input>
          </div>
          {/* Checking if Data is Available or Not */}
          {loading ? (
            <span> loading...</span>
          ) : // If User has Search for Something then This block will run
          search.length > 1 ? (
            filterData.map((item) => (
              <div className="Repo-Cards" key={item.id}>
                <div className="bigText" style={{ color: "#47A6FF" }}>  
                  {item.name}
                </div>
                <div className="normalText">{item.description}</div>
                <div className="block">
                  <div className=" smallText boxStyle">{item.languages.nodes.map(item=>(<div key={Math.random()}>{item.name}</div>))}</div>
                  <div className="smallText" style={{ paddingLeft: "10px" }}>
                    Updated On {new Date(item.updatedAt).toDateString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Else This Block Will Run
            repoData?.map((item) => (
              <div className="Repo-Cards" key={item.id}>
                <div className="bigText" style={{ color: "#47A6FF" }}>
                  {item.name}
                </div>
                <div className="normalText">{item.description}</div>
                <div className="block">
                  <div className=" smallText boxStyle">{item.languages.nodes.map(item=>(<div key={Math.random()}>{item.name}</div>))}</div>
                  <div className="smallText" style={{ paddingLeft: "10px" }}>
                    Updated On {new Date(item.updatedAt).toDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
