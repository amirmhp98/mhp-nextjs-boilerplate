import { locale } from '@/lib/locale';
import { en } from './en';
import { fa } from './fa';

/**
 * The active dictionary. `t()` / `tp()` read from here and nowhere else.
 *
 * Boilerplate only: both dictionaries are kept so either language can be
 * verified, and the two assignments below fail type-checking when a key is
 * missing from one of them. `setup.sh --locale` replaces this file with a
 * single re-export and deletes the other dictionary, so a project has one
 * language and one file to edit.
 */
const enCoversFa: Record<keyof typeof fa, string> = en;
const faCoversEn: Record<keyof typeof en, string> = fa;
void enCoversFa;
void faCoversEn;

export const messages = (locale.id === 'en' ? en : fa) as typeof fa;
