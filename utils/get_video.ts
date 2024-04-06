const tryGetVideo = () => {
    //return new Promise<string>((resolve, reject) => {
    //}
};

export const getVideo = async () => {
  while (true) {
    try {
      return await tryGetVideo();
    } catch (error) {
      console.log(error);
    }
  }
};