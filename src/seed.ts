import "dotenv/config"
// ============================================================
// Seed Script — Populate database with initial data
// ============================================================

import { supabaseAdmin } from './lib/supabase.js'
import { generateSlug } from './lib/slug.js'

async function seed() {
  console.log('🚀 Starting seed process...')

  // 1. Clear existing data (Optional & Dangerous - Use with caution)
  // console.log('🧹 Cleaning existing data...')
  // await supabaseAdmin.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  // await supabaseAdmin.from('posts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  // await supabaseAdmin.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // 2. Create Categories
  console.log('📂 Seeding categories...')
  const categories = [
    { name: 'Technology', icon: 'cpu', sort_order: 1 },
    { name: 'Lifestyle', icon: 'coffee', sort_order: 2 },
    { name: 'Travel', icon: 'map', sort_order: 3 },
  ].map(c => ({
    ...c,
    slug: generateSlug(c.name),
    status: 'active' as const
  }))

  const { data: catData, error: catError } = await supabaseAdmin
    .from('categories')
    .insert(categories)
    .select()

  if (catError) {
    console.error('❌ Error seeding categories:', catError)
    return
  }
  console.log('✅ Categories seeded.')

  // 3. Create Tags Metadata
  console.log('🏷️ Seeding tags...')
  const tags = [
    { name: 'Hono', description: 'Fast web framework' },
    { name: 'Supabase', description: 'Backend as a service' },
    { name: 'TypeScript', description: 'Typed JavaScript' },
  ].map(t => ({
    ...t,
    slug: generateSlug(t.name)
  }))

  const { error: tagError } = await supabaseAdmin.from('tags').insert(tags)
  if (tagError) console.error('❌ Error seeding tags:', tagError)

  // Note: We cannot seed Posts or Comments without valid author_ids (profiles).
  // Profiles are usually created via Supabase Auth signup.
  
  console.log('\n✨ Seed process completed successfully!')
  console.log('💡 Note: Posts and Comments were not seeded because they require valid Profile IDs from Supabase Auth.')
  console.log('👉 Please register a user via /api/auth/register first, then you can create posts via the API.')
}

seed().catch(err => {
  console.error('💥 Unexpected seed error:', err)
  process.exit(1)
})
