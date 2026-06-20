const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'Cart.jsx',
  'Checkout.jsx',
  'profile.jsx',
  'AdminDashboard.jsx',
  'login.jsx',
  'register.jsx',
  'ForgotPassword.jsx',
  'ResetPassword.jsx',
  'OrderSuccess.jsx'
];

const basePath = path.join(__dirname, 'src', 'pages');

filesToUpdate.forEach(file => {
  const filePath = path.join(basePath, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    let modified = false;

    if (!content.includes("react-helmet-async")) {
      content = "import { Helmet } from 'react-helmet-async';\n" + content;
      modified = true;
    }

    if (!content.includes('content="noindex')) {
      // Find the first 'return (' or 'return (' and wrap the outermost element in <> ... </> 
      // This is risky with regex. Instead, I will use a simple replace.
      // Easiest is to find the return statement of the component.
      const returnMatch = content.match(/return\s*\(\s*(<[a-zA-Z]+[^>]*>)/);
      if (returnMatch) {
         const originalTag = returnMatch[1];
         content = content.replace(returnMatch[0], `return (\n    <>\n      <Helmet>\n        <meta name="robots" content="noindex, nofollow" />\n      </Helmet>\n      ${originalTag}`);
         
         // We also need to close the fragment before the last `);` that matches the return.
         // A simple hack for these pages is to just find the last `);` and replace it with `</>);`
         const lastParenIndex = content.lastIndexOf(');');
         if (lastParenIndex !== -1) {
             content = content.substring(0, lastParenIndex) + '\n    </>\n  );' + content.substring(lastParenIndex + 2);
         }
         modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
