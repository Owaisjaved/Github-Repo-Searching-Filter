import axios from "axios";
let userInfo = {
    name:"OwaisJaved",
    token:"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"
}
export const getData = async()=>{
    let fd = await axios.post('https://api.github.com/graphql',{
       query: `{
            user(login: "${userInfo.name}") {
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
          }`
          
    },{
        headers: { Authorization: `Bearer ${userInfo.token}` }
    }).catch(err=>(console.log(err)))
    console.log(fd)
}
console.log(getData())
console.log('herere')
