import zxcvbn from 'zxcvbn';
import { pwnedPassword } from 'hibp';

const strength = {
  0: "Worst ☹",
  1: "Bad ☹",
  2: "Weak ☹",
  3: "Good ☺",
  4: "Strong ☻"
}

const password = document.getElementById('password');
const meter = document.getElementById('password-strength-meter');
const text = document.getElementById('password-strength-text');

password.addEventListener('input', () => {
  const val = password.value;
  const result = zxcvbn(val);

  meter.value = result.score;

  if (val !== "") {
    text.innerHTML = "Strength: " + "<strong>" + strength[result.score] + "</strong>" + "<span class='feedback'>" + result.feedback.warning + " " + result.feedback.suggestions + "</span";
  }
  else {
    text.innerHTML = "";
  }
});

showPasswordFlag.addEventListener('change', () => {
  const x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
});

const password_hibp = document.getElementById('password_hibp');
const output = document.getElementById('password_hibp_output');

let timeoutId = 0;

password_hibp.addEventListener('input', () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(checkHibp, 500);
});

  async function checkHibp() {
    try {
      const numPwns = await pwnedPassword(password_hibp.value);
      if (numPwns > 0) {
        output.innerHTML = `Password found ${numPwns} of times in the haveibeenpwned.com database`;
      } else {
        output.innerHTML = `Password not found in the haveibeenpwned.com database`;
      }
    } catch (err) {
      output.innerHTML = err;
    }
  }

  const password_shhibp = document.getElementById('password_shhibp');
  const output_shhibp = document.getElementById('password_shhibp_output');

  password_shhibp.addEventListener('input', () => {
    output_shhibp.innerHTML = '';
    clearTimeout(timeoutId);
    timeoutId = setTimeout(checkSelfHostedHibp, 500);
  });

  async function checkSelfHostedHibp() {
    if (password_shhibp.value !== '') {
      try {
        const response = await fetch('/selfHostedHibpCheck', {
          body: password_shhibp.value,
          method: 'POST'
        });
        const status = await response.json();
        if (status === 0) {
          output_shhibp.innerHTML = `This password wasn't found in any of the Pwned Passwords loaded into Have I Been Pwned`;
        } else {
          output_shhibp.innerHTML = `This password has been seen ${status} times before<br>
                    This password has previously appeared in a data breach and should never be used. If you've ever used it anywhere before, change it!`;
        }

      } catch (err) {
        output_shhibp.innerHTML = err;
      }
    }
  }
