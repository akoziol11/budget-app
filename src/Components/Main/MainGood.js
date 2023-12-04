// import React from "react";
// import { Navigate } from "react-router-dom";
// import NavigationBar from "../NavigationBar/NavigationBar.js";
// import { checkUser } from "../Authentication/AuthService";
// import "../../home-styles.css"

// const MainGood = () => {
//   return (
//     <div>
//       <NavigationBar />
//       {/* If the user is logged in, show home page, else redirect to login page */}
//       {checkUser() ? (
//         <div>
//           <h1>Welcome to DollarSense!</h1>
//           <br />
//           <div className="home">
//             <h3>Begin by selecting the "Plan" tab to begin planning your monthly budget. 
//               <br/>
//               <br/>
//               You can also adjust your budget any time on the "Plan" page.
//             </h3>
//           </div>
//           <br />
//           <div className="home">
//             <h3>At anytime, you can view and track your budget on the "Track" page.</h3>
//           </div>
//         </div>
//       ) : (
//         <Navigate to="/auth" replace />
//       )}
//     </div>
//   );
// };

// export default MainGood;

// MainGood.js

import React from "react";
import { Navigate } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar.js";
import { checkUser } from "../Authentication/AuthService";
 import "../../home-styles.css"

const MainGood = () => {
  return (
    <div>
      <NavigationBar />
      {checkUser() ? (
        <div className="home">
          <h1>Welcome to Budget Buddy!</h1>
          <p>
            Begin by selecting the "Plan" tab to start planning your monthly budget. You can adjust your budget anytime on the "Plan" page.
          </p>
          <p>
            At any time, you can view and track your budget on the "Track" page.
          </p>
        </div>
      ) : (
        <Navigate to="/auth" replace />
      )}
    </div>
  );
};

export default MainGood;
