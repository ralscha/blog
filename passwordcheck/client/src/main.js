import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import { pwnedPassword } from 'hibp';

zxcvbnOptions.setOptions({
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
});

const strength = {
  0: 'Too guessable',
  1: 'Very guessable',
  2: 'Somewhat guessable',
  3: 'Safely unguessable',
  4: 'Very unguessable'
};

const password = document.getElementById('password');
const meter = document.getElementById('password-strength-meter');
const text = document.getElementById('password-strength-text');
const showPasswordFlag = document.getElementById('showPasswordFlag');
const passwordHibp = document.getElementById('password_hibp');
const output = document.getElementById('password_hibp_output');
const passwordSelfHostedHibp = document.getElementById('password_shhibp');
const outputSelfHostedHibp = document.getElementById('password_shhibp_output');

password.addEventListener('input', () => {
  const value = password.value;

  if (value === '') {
    meter.value = 0;
    text.textContent = '';
    return;
  }

  const result = zxcvbn(value);
  const feedback = [result.feedback.warning, ...result.feedback.suggestions]
    .filter(Boolean)
    .join(' ');

  meter.value = result.score;
  text.textContent = feedback === ''
    ? `Strength: ${strength[result.score]}.`
    : `Strength: ${strength[result.score]}. ${feedback}`;
});

showPasswordFlag.addEventListener('change', () => {
  const inputType = showPasswordFlag.checked ? 'text' : 'password';

  for (const input of [password, passwordHibp, passwordSelfHostedHibp]) {
    input.type = inputType;
  }
});

passwordHibp.addEventListener('blur', () => {
  void checkHibp();
});

passwordSelfHostedHibp.addEventListener('blur', () => {
  void checkSelfHostedHibp();
});

async function checkHibp() {
  if (passwordHibp.value === '') {
    output.textContent = '';
    return;
  }

  output.textContent = 'Checking...';

  try {
    const count = await pwnedPassword(passwordHibp.value);

    output.textContent = count > 0
      ? `This password has appeared ${count} times in the Pwned Passwords dataset. Choose a different one.`
      : 'This password was not found in the Pwned Passwords dataset.';
  } catch (error) {
    output.textContent = error instanceof Error ? error.message : String(error);
  }
}

async function checkSelfHostedHibp() {
  if (passwordSelfHostedHibp.value === '') {
    outputSelfHostedHibp.textContent = '';
    return;
  }

  outputSelfHostedHibp.textContent = 'Checking...';

  try {
    const response = await fetch('/selfHostedHibpCheck', {
      body: passwordSelfHostedHibp.value,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      },
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const count = await response.json();

    outputSelfHostedHibp.textContent = count === 0
      ? 'This password was not found in the local Pwned Passwords dataset.'
      : `This password has appeared ${count} times in the local Pwned Passwords dataset.\nChoose a different one.`;
  } catch (error) {
    outputSelfHostedHibp.textContent = error instanceof Error ? error.message : String(error);
  }
}
