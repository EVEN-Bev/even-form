// Simple test script to verify Supabase storage uploads
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Use hardcoded service role key (for this test only)
const supabaseUrl = 'https://qycfyruqxhypaaehyuvv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5Y2Z5cnVxeGh5cGFhZWh5dXZ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY3NDQ4NywiZXhwIjoyMDYwMjUwNDg3fQ.trRA27Ht2vMM91sDMcVRQu5p59m-t3CH2f1l9SjfCm0';
// Using service role key bypasses RLS policies

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Bucket name
const BUCKET_NAME = 'business-documents';

// Test file path (using an existing image)
const FILE_PATH = path.join(process.cwd(), 'public', 'placeholder.jpg');

// Upload function
async function testUpload() {
  console.log('Starting upload test...');
  console.log(`Using Supabase URL: ${supabaseUrl}`);
  
  try {
    // Read the file
    console.log(`Reading file from: ${FILE_PATH}`);
    const fileBuffer = fs.readFileSync(FILE_PATH);
    console.log(`File size: ${fileBuffer.length} bytes`);
    
    // Upload directly to Supabase
    console.log(`Uploading to bucket: ${BUCKET_NAME}`);
    const { data, error } = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload('test-upload/test-image.jpg', fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });
      
    if (error) {
      console.error('Upload error:', error.message);
      return;
    }
    
    console.log('Upload successful!');
    console.log('File data:', data);
    
    // Get the path or URL
    const { data: urlData } = await supabase
      .storage
      .from(BUCKET_NAME)
      .createSignedUrl('test-upload/test-image.jpg', 60); // 60 second expiry
      
    console.log('File URL:', urlData?.signedUrl);
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the test
testUpload();
