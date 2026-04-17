import { useCallback, useId, useRef, useState } from 'react'
import {
  BackupValidationError,
  buildLocalBackupFile,
  parseAndValidateLocalBackupJson,
  replaceLocalDatabaseFromBackupTables,
  serializeLocalBackupFile,
} from '../../db/backup'
import type { ClassPulseLocalBackupTables } from '../../db/backup'
import { getDatabase } from '../../db/database'

type Props = {
  onReload: () => Promise<void>
}

async function readFileAsUtf8Text(file: File): Promise<string> {
  if (typeof file.text === 'function') {
    return file.text()
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

function triggerJsonDownload(filename: string, json: string): void {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 2_000)
}

export function LocalBackupPanel({ onReload }: Props) {
  const headingId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState<'export' | 'import' | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [pendingReplace, setPendingReplace] = useState<ClassPulseLocalBackupTables | null>(null)

  const handleExport = useCallback(async () => {
    setParseError(null)
    setBusy('export')
    try {
      const db = await getDatabase()
      const doc = await buildLocalBackupFile(db)
      const json = serializeLocalBackupFile(doc)
      const stamp = doc.exportedAt.replace(/[:]/g, '-')
      triggerJsonDownload(`classpulse-backup-${stamp}.json`, json)
    } finally {
      setBusy(null)
    }
  }, [])

  const handlePickImport = useCallback(() => {
    setParseError(null)
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    input.value = ''
    if (!file) return

    setParseError(null)
    setPendingReplace(null)
    setBusy('import')
    try {
      const text = await readFileAsUtf8Text(file)
      const tables = parseAndValidateLocalBackupJson(text)
      setPendingReplace(tables)
    } catch (err) {
      const message =
        err instanceof BackupValidationError
          ? err.message
          : err instanceof SyntaxError
            ? 'File is not valid JSON.'
            : err instanceof Error
              ? err.message
              : 'Could not read backup file.'
      setParseError(message)
    } finally {
      setBusy(null)
    }
  }, [])

  const handleCancelReplace = useCallback(() => {
    setPendingReplace(null)
  }, [])

  const handleConfirmReplace = useCallback(async () => {
    if (!pendingReplace) return
    setBusy('import')
    setParseError(null)
    try {
      const db = await getDatabase()
      await replaceLocalDatabaseFromBackupTables(db, pendingReplace)
      setPendingReplace(null)
      await onReload()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Import failed.'
      setParseError(message)
    } finally {
      setBusy(null)
    }
  }, [onReload, pendingReplace])

  return (
    <section className="panel" aria-labelledby={headingId}>
      <h2 id={headingId}>Local backup (JSON)</h2>
      <p className="muted fineprint">
        Export everything in this device&apos;s ClassPulse store, or restore from a file you exported
        earlier. Import replaces all local ClassPulse data — there is no merge.
      </p>
      <div className="backup-actions">
        <button type="button" onClick={() => void handleExport()} disabled={busy !== null}>
          {busy === 'export' ? 'Preparing…' : 'Export JSON'}
        </button>
        <button type="button" onClick={handlePickImport} disabled={busy !== null}>
          Import JSON…
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          aria-label="Choose ClassPulse JSON backup file"
          onChange={(e) => void handleFileChange(e)}
        />
      </div>
      {parseError ? (
        <p className="backup-error" role="alert">
          {parseError}
        </p>
      ) : null}
      {pendingReplace ? (
        <div className="backup-confirm" role="region" aria-label="Confirm import">
          <p className="backup-confirm-title">Replace all local ClassPulse data?</p>
          <p className="muted fineprint">
            This will permanently remove every session, setting, and capture event stored in this
            browser for ClassPulse, then load the backup file instead. This cannot be undone.
          </p>
          <div className="backup-confirm-buttons">
            <button type="button" onClick={handleCancelReplace} disabled={busy !== null}>
              Cancel
            </button>
            <button
              type="button"
              className="danger-button"
              onClick={() => void handleConfirmReplace()}
              disabled={busy !== null}
            >
              {busy === 'import' ? 'Replacing…' : 'Replace local data'}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
