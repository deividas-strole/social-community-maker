import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getCurrentUser } from '../../api/authApi'
import { getUserProfile, updateMyProfile, uploadMyAvatar } from './profileApi'
import type { UserProfile } from './profileTypes'

function EditProfilePage() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('')
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setIsLoading(true)
        setErrorMessage('')

        const currentUser = await getCurrentUser(token)
        const profileData = await getUserProfile(currentUser.username)

        setProfile(profileData)
        setDisplayName(profileData.displayName || '')
        setBio(profileData.bio || '')
        setAvatarUrl(profileData.avatarUrl || '')
      } catch (error) {
        console.error(error)
        setErrorMessage('Profile could not be loaded. Please log in again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [navigate])

  function handleAvatarFileChange(file: File | null) {
    setSelectedAvatarFile(file)

    if (!file) {
      setAvatarPreviewUrl('')
      return
    }

    setAvatarPreviewUrl(URL.createObjectURL(file))
  }

  async function handleAvatarUpload() {
    if (!selectedAvatarFile) {
      setErrorMessage('Please choose an avatar image first.')
      return
    }

    try {
      setIsUploadingAvatar(true)
      setErrorMessage('')
      setSuccessMessage('')

      const updatedProfile = await uploadMyAvatar(selectedAvatarFile)

      setProfile(updatedProfile)
      setAvatarUrl(updatedProfile.avatarUrl || '')
      setSelectedAvatarFile(null)
      setAvatarPreviewUrl('')

      setSuccessMessage('Avatar uploaded successfully.')
    } catch (error) {
      console.error(error)
      setErrorMessage('Avatar could not be uploaded. Please use an image under 2MB.')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault()

    const trimmedDisplayName = displayName.trim()

    if (!trimmedDisplayName) {
      setErrorMessage('Display name is required.')
      return
    }

    try {
      setIsSaving(true)
      setErrorMessage('')
      setSuccessMessage('')

      const updatedProfile = await updateMyProfile({
        displayName: trimmedDisplayName,
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
      })

      setProfile(updatedProfile)
      setDisplayName(updatedProfile.displayName || '')
      setBio(updatedProfile.bio || '')
      setAvatarUrl(updatedProfile.avatarUrl || '')

      localStorage.setItem(
        'user',
        JSON.stringify({
          id: updatedProfile.id,
          email: updatedProfile.email,
          username: updatedProfile.username,
          displayName: updatedProfile.displayName,
        })
      )

      setSuccessMessage('Profile updated successfully.')
    } catch (error) {
      console.error(error)
      setErrorMessage('Profile could not be updated.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5 text-slate-300">
          Loading profile editor...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-73px)] px-6 py-10">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap gap-4">
          <Link className="text-sm text-slate-400 underline hover:text-white" to="/dashboard">
            ← Dashboard
          </Link>

          {profile && (
            <Link
              className="text-sm text-slate-400 underline hover:text-white"
              to={`/users/${profile.username}`}
            >
              View public profile
            </Link>
          )}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Profile</p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">Edit Profile</h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Update your public profile information. You can upload an avatar image or manually use
            an avatar image URL.
          </p>

          {errorMessage && (
            <div className="mt-6 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mt-6 rounded-lg border border-emerald-800 bg-emerald-950 px-4 py-3 text-sm text-emerald-200">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300" htmlFor="displayName">
                Display Name
              </label>

              <input
                id="displayName"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={100}
                required
              />

              <p className="mt-2 text-xs text-slate-500">
                This name appears on posts, comments, and your public profile.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300" htmlFor="bio">
                Bio
              </label>

              <textarea
                id="bio"
                className="mt-2 min-h-32 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                maxLength={500}
                placeholder="Tell people about yourself..."
              />

              <p className="mt-2 text-xs text-slate-500">{bio.length}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300" htmlFor="avatarFile">
                Upload Avatar Image
              </label>

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-950 text-2xl font-bold text-slate-200">
                  {avatarPreviewUrl ? (
                    <img
                      src={avatarPreviewUrl}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Current avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    displayName.charAt(0).toUpperCase() || '?'
                  )}
                </div>

                <div className="flex-1">
                  <input
                    id="avatarFile"
                    type="file"
                    accept="image/*"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-slate-950 hover:file:bg-slate-200"
                    onChange={(event) => handleAvatarFileChange(event.target.files?.[0] || null)}
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Upload a JPG, PNG, GIF, or WebP image. Maximum size: 2MB.
                  </p>

                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={!selectedAvatarFile || isUploadingAvatar}
                    className="mt-3 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300" htmlFor="avatarUrl">
                Avatar URL
              </label>

              <input
                id="avatarUrl"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-white"
                value={avatarUrl}
                onChange={(event) => setAvatarUrl(event.target.value)}
                maxLength={500}
                placeholder="https://example.com/avatar.jpg"
              />

              <p className="mt-2 text-xs text-slate-500">
                Optional. If you upload an avatar image, this field will update automatically.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>

              {profile && (
                <Link
                  to={`/users/${profile.username}`}
                  className="rounded-lg border border-slate-700 px-5 py-3 text-center font-semibold text-white hover:bg-slate-800"
                >
                  Cancel
                </Link>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default EditProfilePage
