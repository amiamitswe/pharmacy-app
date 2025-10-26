import React from "react";

function Footer() {
  return (
    <footer>
      <div className="text-center py-4">
        <p>{new Date().getFullYear()} @ Pharmacy App. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
