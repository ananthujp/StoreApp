import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";

saveFile = async () => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === "granted") {
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync("Download", asset, false);
  }
};
const fileUri = FileSystem.documentDirectory + "store.apk";
const uri =
  "https://firebasestorage.googleapis.com/v0/b/greenapp-ff6c2.appspot.com/o/Store-0b38be0dcfd84606a6ae30791919f34c-signed.apk?alt=media&token=62ce81fb-092c-4d36-981d-828da5527371";
FileSystem.downloadAsync(uri, fileUri)
  .then(({ uri }) => {
    saveFile(uri);
  })
  .catch((error) => {
    console.error(error);
  });
