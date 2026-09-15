import os
import unittest

os.environ.setdefault("SECRET_KEY", "test-secret")
os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://test:test@localhost/test")

from pydantic import ValidationError

from schemas import UserSettings


class UiLanguageValidationTests(unittest.TestCase):
    """ui_language is mirrored into a cookie the frontend resolves against its
    shipped message catalogs, so only codes with a catalog are accepted."""

    def test_accepts_supported_languages(self) -> None:
        for code in ("en", "fr"):
            self.assertEqual(UserSettings(ui_language=code).ui_language, code)

    def test_accepts_null_for_browser_default(self) -> None:
        self.assertIsNone(UserSettings(ui_language=None).ui_language)
        self.assertNotIn("ui_language", UserSettings().model_dump(exclude_unset=True))

    def test_rejects_unsupported_languages(self) -> None:
        for code in ("de", "xx", "fr-FR", ""):
            with self.assertRaises(ValidationError):
                UserSettings(ui_language=code)


if __name__ == "__main__":
    unittest.main()
