const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

const PORT = process.env.PORT || 8000;

const FULL_NAME = process.env.FULL_NAME || "john_doe";
const DOB = process.env.DOB || "17091999";
const EMAIL = process.env.EMAIL || "john@xyz.com";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "ABCD123";

function isAlpha(str) {
  return /^[a-zA-Z]+$/.test(str);
}

function isNumeric(str) {
  return /^\d+$/.test(str);
}

function isSpecialChar(str) {
  return !isAlpha(str) && !isNumeric(str);
}

function alternateCaps(str) {
  return str
    .split("")
    .reverse()
    .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

app.post("/bfhl", (req, res) => {
  try {
    const data = req.body.data || [];

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];

    let sum = 0;
    let alpha_concat = "";

    data.forEach((item) => {
      if (isNumeric(item)) {
        const num = parseInt(item);
        sum += num;
        if (num % 2 === 0) {
          even_numbers.push(item);
        } else {
          odd_numbers.push(item);
        }
      } else if (isAlpha(item)) {
        alphabets.push(item.toUpperCase());
        alpha_concat += item;
      } else {
        special_characters.push(item);
      }
    });

    const response = {
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string: alternateCaps(alpha_concat)
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in /bfhl:", error);
    res.status(500).json({
      is_success: false,
      user_id: `${FULL_NAME}_${DOB}`,
      message: "Internal Server Error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
