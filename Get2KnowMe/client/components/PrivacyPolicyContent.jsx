const PrivacyPolicy = () => (
  <div className="p-4 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
    <p className="mb-2">Effective Date: [June 28, 2025]</p>

    <p className="mb-4">
      Welcome to <strong>Get2KnowYou</strong>, an application that helps
      individuals—particularly those who are neurodivergent—create a
      Communication Passport to share their unique communication needs and
      preferences with others.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">1. Who We Are</h2>
    <p className="mb-4">
      We are the creators of Get2KnowYou. The App allows users to create a
      secure communication profile that can be shared using a QR code or unique
      passcode.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">
      2. What Data We Collect
    </h2>
    <ul className="list-disc list-inside mb-4">
      <li>
        <strong>Account Information:</strong> Email, Username, Password (hashed)
      </li>
      <li>
        <strong>Communication Passport:</strong> First/Last Name, Preferred
        Name, Diagnosis, Communication Preferences, Trusted Contact Info,
        Profile Passcode, Other Notes
      </li>
      <li>
        <strong>Metadata:</strong> Timestamps for creation and update
      </li>
    </ul>

    <h2 className="text-2xl font-semibold mt-6 mb-2">
      3. How and Why We Use Your Data
    </h2>
    <p className="mb-2">We use your data for the following lawful purposes:</p>
    <ul className="list-disc list-inside mb-4">
      <li>Account creation and authentication</li>
      <li>
        Displaying your Communication Passport when you choose to share it
      </li>
      <li>App improvement and support</li>
    </ul>


    <h2 className="text-2xl font-semibold mt-6 mb-2">
      4. How Your Data is Shared
    </h2>
    <p className="mb-4">
      Your passport data is only visible when you share your passcode or QR
      code. We don’t sell your data. Data is hosted using Render and MongoDB
      Atlas.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">
      5. How Long We Keep Your Data
    </h2>
    <p className="mb-4">
      We keep your data while your account is active. You can delete your data
      anytime.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">6. Your Rights</h2>
    <p className="mb-2">You can:</p>
    <ul className="list-disc list-inside mb-4">
      <li>Access, correct, or delete your data</li>
      <li>Withdraw consent</li>
      <li>File complaints with the ICO or your local authority</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-6 mb-2">7. Security</h2>
    <p className="mb-4">
      Passwords are hashed. Data is encrypted in transit. Only you can share
      your passcode or QR code.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">9. Children's Privacy</h2>
    <p className="mb-4">
      Get2KnowYou is not intended for use by children under the age of 16, or
      under 13 in the United Kingdom, unless they have the verifiable consent of
      a parent or legal guardian. We do not knowingly collect personal data from
      users under these age thresholds without appropriate consent. If we become
      aware that we have inadvertently collected data without such consent, we
      will delete it as soon as possible.
    </p>
    
    <h2 className="text-2xl font-semibold mt-6 mb-2">8. Contact</h2>
    <p>Email us at: [jwbarry@outlook.com]</p>
  </div>
);

export default PrivacyPolicy;
