
{
  search(query: "location:'Kyiv' followers:>1000", type: USER, first: 10) {
    edges {
      node {
        __typename
        ... on User {
          email
          login
        	location
        }
      }
    }
  }
}

