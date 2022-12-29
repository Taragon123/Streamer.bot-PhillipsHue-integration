This project requires a PhillipsHue bridge and works best if the bridge has been given a static IP.
In addition, if the PC the script is running on has a static IP, you'll be able to use the API from any device on the local network.

The API would *ideally* use POST requests, but to work with [streamerbot](https://streamer.bot/) it uses GET requests and URL params instead.
    As a side product of this, using # in in the colour definition doesn't work due to URL encoding, but '%23' does XD

You'll need to copy the example `hue_keys.json` file and fill in the details.
    See the documention [here](https://developers.meethue.com/develop/hue-api-v2/) for direct info on the PhillipsHue API V2 if you need to get this information.
    Alternatively, the code is not set up for this, but you can use the [node-hue-api](https://www.npmjs.com/package/node-hue-api) this project utalizes

You can import the commands and actions right into streamerbot using [this file](./streamerbot%20actions.txt)
    You will need to change the IP address in the actions to use `localhost` if the computer running the script does *NOT* have a static IP
    otherwise set the ip address in the actions to your given computer's IP
    The port is set to 8000 by default, this can be changed in [index.ts](./src/index.ts) if you really want to


For each light, you will need to set the name of the light in the action. Make sure to use the same capitalization and replace all spaces with '%20' for URL encoding
    Use the names as they appear in the app


Set colour fetch action:
* http://`192.168.1.2`:8000/setcolour?colour=%rawinput%&light=`Desk%20lamp`

Set light state fetch action:
* http://`192.168.1.2`:8000/seton?on=false&light=`Desk%20lamp`


You can run the script using `npm run hue` or the existing shortcut that links to a bat file to make things easy


For questions, reach out to Taragon123#9654 on discord