const CookiePolicyContent = () => (
  <div className="p-4 max-w-4xl mx-auto">
    <p className="mb-2">
      <strong>Last Updated:</strong> March 12, 2026
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">What Are Cookies?</h2>
    <p className="mb-4">
      Cookies are small text files stored on your device when you visit a
      website. They help the website remember your preferences and enable
      essential functionality.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Our Cookie Usage</h2>
    <p className="mb-4">
      Get2KnowMe uses <strong>only strictly necessary cookies</strong> required
      for the website to function. We do not use cookies for analytics,
      marketing, or tracking purposes.
    </p>

    <h3 className="text-xl font-semibold mt-4 mb-2">Essential Cookies</h3>
    <p className="mb-4">
      These cookies are necessary for the website to work and cannot be turned
      off:
    </p>

    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-2">
        1. Authentication Cookie (<code className="bg-gray-100 px-2 py-1 rounded">refreshToken</code>)
      </h4>
      <ul className="list-disc list-inside mb-4 ml-4">
        <li>
          <strong>Purpose:</strong> Keeps you logged in securely
        </li>
        <li>
          <strong>Duration:</strong> 7 days or until you log out
        </li>
        <li>
          <strong>Data stored:</strong> Encrypted authentication token
        </li>
        <li>
          <strong>Legal basis:</strong> Legitimate interest (service
          functionality)
        </li>
      </ul>
    </div>

    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-2">
        2. Security Cookies (<code className="bg-gray-100 px-2 py-1 rounded">_csrf</code>,{' '}
        <code className="bg-gray-100 px-2 py-1 rounded">csrf-token</code>)
      </h4>
      <ul className="list-disc list-inside mb-4 ml-4">
        <li>
          <strong>Purpose:</strong> Protects your account from cyber attacks
        </li>
        <li>
          <strong>Duration:</strong> Until you close your browser (session)
        </li>
        <li>
          <strong>Data stored:</strong> Random security tokens
        </li>
        <li>
          <strong>Legal basis:</strong> Legitimate interest (security)
        </li>
      </ul>
    </div>

    <h2 className="text-2xl font-semibold mt-6 mb-2">
      No Consent Required
    </h2>
    <p className="mb-4">
      Under Article 5(3) of the ePrivacy Directive and UK PECR Regulation 6(1),
      strictly necessary cookies do not require user consent. These cookies are
      essential for the website to function properly and cannot be disabled.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Your Choices</h2>

    <h3 className="text-xl font-semibold mt-4 mb-2">Blocking Cookies</h3>
    <p className="mb-2">
      You can block cookies through your browser settings:
    </p>
    <ul className="list-disc list-inside mb-4 ml-4">
      <li>
        <a
          href="https://support.google.com/chrome/answer/95647"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Chrome
        </a>
      </li>
      <li>
        <a
          href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Firefox
        </a>
      </li>
      <li>
        <a
          href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Safari
        </a>
      </li>
      <li>
        <a
          href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Edge
        </a>
      </li>
    </ul>
    <p className="mb-4">
      <strong>Note:</strong> Blocking these cookies will prevent you from
      logging in and using the website.
    </p>

    <h3 className="text-xl font-semibold mt-4 mb-2">Deleting Cookies</h3>
    <p className="mb-4">
      Logging out will remove the authentication cookie. Security cookies are
      automatically deleted when you close your browser.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Data Protection</h2>
    <p className="mb-2">All our cookies:</p>
    <ul className="list-disc list-inside mb-4 ml-4">
      <li>✅ Are encrypted and secure</li>
      <li>✅ Are httpOnly (protected from JavaScript access)</li>
      <li>✅ Use SameSite=Strict (prevents cross-site attacks)</li>
      <li>✅ Contain no personal information</li>
      <li>✅ Cannot track you across other websites</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-6 mb-2">We Do Not Use</h2>
    <ul className="list-disc list-inside mb-4 ml-4">
      <li>❌ Analytics cookies</li>
      <li>❌ Marketing cookies</li>
      <li>❌ Third-party tracking cookies</li>
      <li>❌ Advertising cookies</li>
      <li>❌ Social media cookies</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Cookie Summary Table</h2>
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Cookie Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Purpose
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Duration
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">
              <code className="bg-gray-100 px-2 py-1 rounded">refreshToken</code>
            </td>
            <td className="border border-gray-300 px-4 py-2">
              Maintains your secure login session
            </td>
            <td className="border border-gray-300 px-4 py-2">7 days</td>
            <td className="border border-gray-300 px-4 py-2">
              Authentication
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">
              <code className="bg-gray-100 px-2 py-1 rounded">_csrf</code>
            </td>
            <td className="border border-gray-300 px-4 py-2">
              Protects against cross-site request forgery attacks
            </td>
            <td className="border border-gray-300 px-4 py-2">Session</td>
            <td className="border border-gray-300 px-4 py-2">Security</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">
              <code className="bg-gray-100 px-2 py-1 rounded">csrf-token</code>
            </td>
            <td className="border border-gray-300 px-4 py-2">
              Additional CSRF protection
            </td>
            <td className="border border-gray-300 px-4 py-2">Session</td>
            <td className="border border-gray-300 px-4 py-2">Security</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
    <p className="mb-4">
      For questions about our cookie policy, please contact us through the app
      or via our support channels.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">
      Changes to This Policy
    </h2>
    <p className="mb-4">
      We may update this policy from time to time to reflect changes in our
      practices or for legal, operational, or regulatory reasons. Please check
      this page periodically for updates. The "Last Updated" date at the top
      indicates when this policy was last revised.
    </p>
  </div>
);

export default CookiePolicyContent;
