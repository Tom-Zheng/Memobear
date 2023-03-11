const domain = "com.tomzheng.markdownprinter";

function exists(key) {
  return get(key) === undefined;
}

function get(key) {
  return $keychain.get(key, domain);
}

function set(key, val) {
  if (exists(key)) {
    del(key);
  }
  return $keychain.set(key, val, domain);
}

function del(key) {
  if (!exists(key)) {
    return true;
  }
  return $keychain.remove(key, domain);
}

function clear() {
  return $keychain.clear(domain);
}

module.exports = {
  exists,
  get,
  set,
  del,
  clear
};
