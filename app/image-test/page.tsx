export default function ImageTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border p-4 rounded text-center">
          <img
            src="/even-logo.png"
            alt="EVEN Logo"
            className="h-40 w-40 object-contain mx-auto border"
          />
          <p className="mt-2 font-medium">EVEN Logo</p>
          <p className="text-sm text-gray-500">Path: /even-logo.png</p>
        </div>

        <div className="border p-4 rounded text-center">
          <img
            src="/images/matt-vandelec.png"
            alt="Matt Vandelec"
            className="h-40 w-40 object-contain mx-auto border"
          />
          <p className="mt-2 font-medium">Matt Vandelec</p>
          <p className="text-sm text-gray-500">Path: /images/matt-vandelec.png</p>
        </div>

        <div className="border p-4 rounded text-center">
          <img
            src="/images/james-ganino.png"
            alt="James Ganino"
            className="h-40 w-40 object-contain mx-auto border"
          />
          <p className="mt-2 font-medium">James Ganino</p>
          <p className="text-sm text-gray-500">Path: /images/james-ganino.png</p>
        </div>

        <div className="border p-4 rounded text-center">
          <img
            src="/images/alana-wigdahl.png"
            alt="Alana Wigdahl"
            className="h-40 w-40 object-contain mx-auto border"
          />
          <p className="mt-2 font-medium">Alana Wigdahl</p>
          <p className="text-sm text-gray-500">Path: /images/alana-wigdahl.png</p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h3 className="font-semibold">Troubleshooting:</h3>
        <ul className="list-disc pl-6 mt-2">
          <li>
            If images are not showing, check that they were properly saved to the /public/images/
            directory
          </li>
          <li>Verify that your next.config.mjs has the correct configuration for images</li>
          <li>Make sure your deployment includes the static assets</li>
          <li>Try clearing your browser cache</li>
        </ul>
      </div>
    </div>
  )
}
