// place files you want to import through the `$lib` alias in this folder.

export function between(reference, check, tolerance) { //https://stackoverflow.com/a/6454237/16216937
    return Math.abs(reference - check) <= tolerance
}