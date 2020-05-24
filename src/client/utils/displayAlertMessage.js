// import React from 'react';
// import { Button, Alert } from 'react-bootstrap';

// function renderAlertWithX(alertMessage, pathname) {
//   if (alertMessage) {
//     const { text, variant } = alertMessage;
//     const btnVariant = `outline-${alertMessage.variant}`;
//     return (
//       <Alert variant={variant}>
//         <span>{text}</span>
//         <span className="float-right">
//           <Button
//             onClick={() => {
//               replace(
//                 `${campgroundId}`,
//                 { campground, alertMessage: null }
//               );
//               setAlertMessage(null);
//             }}
//             variant={btnVariant}
//             size="sm"
//           >
//             X
//           </Button>
//         </span>
//       </Alert>
//     );
//   }
//   return null;
// }

// export default displayAlertMessage;