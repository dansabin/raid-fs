import inquirer from 'inquirer';

const questions = [{}];

export const execute = () => {
    inquirer
      .prompt(questions)
      .then(answers => {
          console.log('\nOrder receipt:');
          console.log(JSON.stringify(answers, null, '  '));
      })
      .catch(error => {
          if (error.isTtyError) {
              // Prompt couldn't be rendered in the current environment
          } else {
              // Something else when wrong
          }
      });
};
