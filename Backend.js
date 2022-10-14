import axios from "axios";
const postFunc = async (profID, threadID, msgID) => {
  console.log("called");
  axios({
    method: "get",
    url:
      "https://greenclubstore2.herokuapp.com/user?prof=" +
      profID +
      "&thread=" +
      threadID +
      "&msg=" +
      msgID,
    data: "",
  }).then((response) => {
    // console.log(response);
  });
};
export default postFunc;
