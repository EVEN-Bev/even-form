export default function TestPublicPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Testing Public Assets</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl mb-2">Logo Test</h2>
          <div className="p-4 border rounded">
            <p className="mb-2">Direct path: /even-logo.png</p>
            <img src="/even-logo.png" alt="Logo Test" className="h-10 w-10 object-contain border" />
          </div>
        </div>

        <div>
          <h2 className="text-xl mb-2">Team Images Test</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded">
              <p className="mb-2">Matt: /images/matt-vandelec.png</p>
              <img
                src="/images/matt-vandelec.png"
                alt="Matt"
                className="h-20 w-20 object-contain border"
              />
            </div>
            <div className="p-4 border rounded">
              <p className="mb-2">James: /images/james-ganino.png</p>
              <img
                src="/images/james-ganino.png"
                alt="James"
                className="h-20 w-20 object-contain border"
              />
            </div>
            <div className="p-4 border rounded">
              <p className="mb-2">Alana: /images/alana-wigdahl.png</p>
              <img
                src="/images/alana-wigdahl.png"
                alt="Alana"
                className="h-20 w-20 object-contain border"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl mb-2">Root Public Test</h2>
          <div className="p-4 border rounded">
            <p className="mb-2">Favicon: /favicon.png</p>
            <img
              src="/favicon.png"
              alt="Favicon Test"
              className="h-10 w-10 object-contain border"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
