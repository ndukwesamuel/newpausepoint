import fireImage from "../../assets/images/fire.png";

import healthImage from "../../assets/images/health.png";
import Alarm from "../../assets/images/Alarm.png";
import Burglary from "../../assets/images/Burglary.png";
import Kidnap from "../../assets/images/Kidnap.png";

export const emergencydata = [
  {
    id: 1,
    name: "Fire Alarm",
    description: " In the event of a fire alarm emergency",
    image: fireImage,
    type: "fire",
  },

  {
    id: 2,
    name: "Health Alarm",
    description: " In the event of a Health  emergency",

    image: healthImage,
    type: "health",
  },

  {
    id: 3,
    name: "Theft Alarm",
    description: " In the event of a Theft",

    image: Alarm,
    type: "theft",
  },

  {
    id: 4,
    name: "Burglary Alarm",

    description: " In the event of a Burglary  emergency",

    image: Burglary,

    type: "burglary",
  },

  {
    id: 5,
    name: "Kidnap Alarm",
    description: " In the event of a Kidnap  emergency",
    image: Kidnap,
    type: "kidnapping",
  },
];
