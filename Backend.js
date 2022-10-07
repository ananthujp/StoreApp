import axios from "axios";
const postFunc = async (profID, threadID, msgID) => {
  console.log("called");
  axios({
    method: "get",
    url:
      "http://192.168.1.4:3000/user?prof=" +
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
