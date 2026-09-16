#! /usr/bin/env nu

let root_dir = $env.PROCESS_PATH | path dirname
let cache_dir = $"($root_dir)/.cache"
let dist_dir = $"($root_dir)/build"
let public_dir = $"($root_dir)/public"

def "main" [] {}

###############################################################################
# Node env commands
###############################################################################

# Starts Next.js in development mode with hot-code reloading, error reporting, and more
def "main dev" [] {
  ^pnpm next dev .
}

# Creates an optimized production build of your application
def "main build" [] {
  main prepare --production
  ^pnpm next build .
}

def "main lint" [] {
  ^pnpm next lint .
}

def "main download resume-assets" [
  --resume-version: string
] {
  # Download resume assets into cache dir
  get-resume-assets --tag ($resume_version | default "latest")
  # Copy cache downloaded file into public dir
  (load-cache-asset
    ($public_dir | path join "static/resume")
    "cover.pdf"
    "resume.pdf"
    "resume.json"
  )
}

# Project start-up command install dependencies and download necesary assets
def "main prepare" [
  --production # Run for production env
  --development # Run for development env (default)
] {
  if $production {
    pnpm install --frozen-lockfile
    main download resume-assets
  } else {
    pnpm install
    main download resume-assets    
  }

}

###############################################################################
# Helpers
###############################################################################

def ternary [
  predicate: bool
  truthy: any
  falsy: any
] {
  if ($predicate) { $truthy } else { $falsy }
}

def prepare-dir [
  dir: path
] {
  if not ($dir | path exists) {
    mkdir $dir
  }
}

def download-release-assets [
  release_file: path
  output_dir: path
] {
  let release_context = open -r $release_file 
    | from json
  let assets = $release_context | get assets

  print "Downloading resume assets..."
  for $asset in $assets {
    let url = $asset | get browser_download_url
    let filename = $asset | get name
    let ouput = $output_dir | path join $filename
    print $"Downloading ($ouput)"
    http get $url | save -f $ouput
  }
}

def get-resume-assets [
  --tag: string # Version of tag name of the github release example: v1.0.0
  --repository: string # Repository to download from "owner/repo"
] {
  let tag = $tag | default "latest"
  let repository = $repository | default "maxkalavera/curriculum-vitae-typst"
  let url = (ternary 
    ( ($tag | is-empty) or ($tag == "latest") )
    $"https://api.github.com/repos/($repository)/releases/latest"
    $"https://api.github.com/repos/($repository)/releases/tags/($tag)"
  )
  prepare-dir $cache_dir

  let release_file = $cache_dir | path join "release.json"
  # Download release context data into cache
  http get $url | save -f $release_file
  download-release-assets $release_file $cache_dir
}

def load-cache-asset [
  output_dir: path
  ...cache_files: path
] {
  $cache_files | each { 
    | filename | 
    cp -f ($cache_dir | path join $filename) $output_dir
  }
  return
}