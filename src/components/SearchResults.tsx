// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getPostsBySearchKeyword, getPostsBySearchQuery } from "../firebase/firestoreService";

// const SearchResults = () => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const queryParams = new URLSearchParams(location.search)
//   const searchQuery = queryParams.get('query');
//   const [results, setResults] = useState([]);

//   useEffect(() => {
//     const fetchResults = async () => {
//       if(searchQuery) {
//         const fetchedResults = await getAllPostsBySearchQuery(,searchQuery)
//         setResults(fetchedResults)
//       }
//     }
//     fetchResults()
//   }, [searchQuery])

//   const handlePostClick = (postId) => {
//     navigate(`'/post/${postId}`)
//   }

//   return (
//     <div>
//       {
//         results.length > 0 ? (
//          <ul>
//           {results.map(result => (
//             <li key={result.id} onClick={() => handlePostClick(result.id)}>
//               <h2>{result.title}</h2>
//               <p>{result.nickname}</p>
//               <p>{result.content}</p>
//             </li>
//           ))}
//          </ul>
//         )
//         : (
//           <p>검색 결과가 없습니다</p>
//         )
//       }
//     </div>
//   )
// }

// export default SearchResults;
