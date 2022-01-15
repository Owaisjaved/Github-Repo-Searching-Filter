import React, { useEffect, useState } from 'react'
import axios from 'axios'
export const Search = () => {

    /**
     * The Varaiable is available to all.
     * Changing this name will Populate Data Regarding to the User Defined
     * @public
     */
    var globalUserName = 'OwaisJaved'

    //** @States*/
    //User Search Value
    const [search, setSearch] = useState('')
    // User Profile Data
    const [userdata, setUserData] = useState({})
    // User Repository Data
    const [repoData, setRepoData] = useState([])
    // Filtered Data from Searched Value
    const [filterData, setFilterData] = useState([])
    // Data Loading State
    const [loading, setLoading] = useState(true)

    console.log(loading)
    //** @function
    // A Function that Fetches User Profile Data. */
    const getUser = async () => {
        let url = `https://api.github.com/users/${globalUserName}`
        let fetchedData = await axios.get(url)
        setUserData(fetchedData.data)
    }
    //** @function
    // A Function that Fetches User Repositories Data & Set result into SetState. */
    const getUserRepo = async () => {
        let url = `https://api.github.com/users/${globalUserName}/repos`
        let fetchedData = await axios.get(url)
        setRepoData(fetchedData.data)
        setLoading(false)
    }
    //** @function
    // A Function that Set values for States. */
    const handleSearch = (e) => {
        setSearch(e.target.value)
        /**
         * Returns Searched Data
         * Checking User Searched Value in User Repository Data
         * @returns {array}
         */
        let filterData = repoData.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        setFilterData(filterData)
    }

    // React UseEffect 
    useEffect(() => {
        getUser()
        getUserRepo()
    }, [])

    return (
        <div className='Main'>
            <div className='Container'>
                {/* Checking if Data is Available or Not */}
                {loading ? <span>Loading...</span>
                    :
                    <div className='left-side'>
                        <div className='user-image'><img src={userdata.avatar_url} alt='UserProfile' ></img></div>
                        <div>
                            <div className='bigText'>{userdata.name}</div>
                            <div className='normalText'>{userdata.login}</div>
                        </div>
                        <div className='normalText'>{userdata.bio}</div>
                        <div className='profile-btn'>Edit Profile</div>
                        <div className='block'>
                            <div className='smallText'>{userdata.followers} follower</div>
                            <span className='smallText'>.</span>
                            <div className='smallText'>{userdata.following} following</div>
                        </div>
                        <div>{userdata.location}</div>
                    </div>
                }
                <div className='right-side'>
                    <div className='repo-detail'>
                        {repoData.length} Repositories
                    </div>
                    <div id='searching'>
                        <input placeholder='Search Repo...' type={'search'} value={search} onChange={(e) => handleSearch(e)}></input>
                    </div>
                      {/* Checking if Data is Available or Not */}
                    {
                        loading ?
                            <span> loading...</span>
                            :
                            // If User has Search for Something then This block will run
                            search.length > 1 ?
                                filterData.map(item => (
                                    <div className='Repo-Cards' key={item.id}>
                                        <div className='bigText' style={{ color: '#47A6FF' }}>{item.name}</div>
                                        <div className='normalText'>{item.description}</div>
                                        <div className='block'>
                                            <div className=' smallText boxStyle' >{item.language}</div>
                                            <div className='smallText' style={{ paddingLeft: '10px' }}>Updated On {new Date(item.updated_at).toDateString()}</div>
                                        </div>
                                    </div>
                                ))
                                :
                                // Else This Block Will Run
                                repoData?.map(item => (
                                    <div className='Repo-Cards' key={item.id}>
                                        <div className='bigText' style={{ color: '#47A6FF' }}>{item.name}</div>
                                        <div className='normalText'>{item.description}</div>
                                        <div className='block'>
                                            <div className=' smallText boxStyle' >{item.language}</div>
                                            <div className='smallText' style={{ paddingLeft: '10px' }}>Updated On {new Date(item.updated_at).toDateString()}</div>
                                        </div>
                                    </div>
                                ))
                    }

                </div>
            </div>
        </div>
    )
}
